'use client';

/**
 * Sweet Dreams site events: the actions a visitor takes that make them a
 * customer, sent to Vercel Web Analytics as custom events. Copied into each
 * client site from the Sweet Dreams platform (templates/site-events); the
 * client portal, the admin and the monthly report read them back.
 *
 * Put it in app/layout.tsx, right beside <Analytics />:
 *
 *   import { Analytics } from '@vercel/analytics/next';
 *   import SiteEvents from '@/components/SiteEvents';
 *   ...
 *   <Analytics />
 *   <SiteEvents />
 *
 * What it sends, and nothing else:
 *   Phone tap       a tel: link
 *   Email tap       a mailto: link
 *   Directions tap  a link to Google Maps, Apple Maps or Waze
 *   Booking click   a link to a booking page (the site's own /book, or a
 *                   booking service), or anything marked data-sd-event
 *   Form sent       a form submitted (data-sd-form="manual" on a form that
 *                   reports itself with sendSiteEvent after it succeeds)
 *
 * Each event carries one property, `place`: where on the page it happened
 * (the nearest header, footer, nav or named section, or data-sd-place). Never
 * a phone number, an address or anything a visitor typed. Vercel records the
 * page on its own.
 *
 * Keep the five names exactly as they are: the platform reads them by name
 * (lib/analytics/site-events.ts), and its test checks this file against it.
 */
import { useEffect } from 'react';
import { track } from '@vercel/analytics';

export const SITE_EVENT_NAMES = ['Phone tap', 'Email tap', 'Directions tap', 'Form sent', 'Booking click'] as const;
export type SiteEventName = (typeof SITE_EVENT_NAMES)[number];

const PLACE_MAX = 40;

const MAPS = /(^|\.)google\.[a-z.]+\/maps|^maps\.google\.|^goo\.gl\/maps|^maps\.app\.goo\.gl|^maps\.apple\.com|(^|\.)waze\.com\/(ul|live-map)/;
const BOOKING_HOSTS =
  /(^|\.)(calendly\.com|acuityscheduling\.com|as\.me|square\.site|squareup\.com|vagaro\.com|booksy\.com|setmore\.com|fresha\.com|mindbodyonline\.com|glossgenius\.com|styleseat\.com|schedulicity\.com|tidycal\.com|cal\.com|youcanbook\.me|simplybook\.me|book\.squareup\.com)$/;
const BOOKING_PATHS = /^\/(book|booking|bookings|schedule|appointments?|reserve|reservations?)(\/|$|\?)/;

function clean(v: string | null | undefined): string {
  const s = (v ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, PLACE_MAX);
  return s || 'page';
}

/** Where on the page: a marked place, else the nearest landmark or named section. */
function placeOf(el: Element): string {
  const marked = el.closest('[data-sd-place]');
  if (marked) return clean(marked.getAttribute('data-sd-place'));
  const landmark = el.closest('header, footer, nav, aside, section[id], section[aria-label], [role="dialog"]');
  if (!landmark) return 'page';
  if (landmark.getAttribute('role') === 'dialog') return 'popup';
  const tag = landmark.tagName.toLowerCase();
  if (tag === 'section') return clean(landmark.getAttribute('aria-label') || landmark.id);
  return tag;
}

function isName(v: string | null): v is SiteEventName {
  return v !== null && (SITE_EVENT_NAMES as readonly string[]).includes(v);
}

/** The event a link stands for, or null for an ordinary link. */
function eventForLink(a: HTMLAnchorElement): SiteEventName | null {
  const href = (a.getAttribute('href') ?? '').trim();
  const lower = href.toLowerCase();
  if (lower.startsWith('tel:')) return 'Phone tap';
  if (lower.startsWith('mailto:')) return 'Email tap';
  let url: URL | null = null;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  const hostPath = `${url.hostname.replace(/^www\./, '')}${url.pathname}`;
  if (MAPS.test(hostPath) || (url.hostname.endsWith('google.com') && url.pathname.startsWith('/maps'))) return 'Directions tap';
  if (BOOKING_HOSTS.test(url.hostname.replace(/^www\./, ''))) return 'Booking click';
  if (url.origin === window.location.origin && BOOKING_PATHS.test(url.pathname)) return 'Booking click';
  return null;
}

/** For a form or a button that reports itself, after it succeeds. */
export function sendSiteEvent(name: SiteEventName, place = 'page'): void {
  try {
    track(name, { place: clean(place) });
  } catch {
    // Counting must never break the site.
  }
}

export default function SiteEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;
      const marked = target.closest('[data-sd-event]');
      if (marked) {
        const name = marked.getAttribute('data-sd-event');
        if (isName(name)) sendSiteEvent(name, placeOf(marked));
        return;
      }
      const a = target.closest('a[href]');
      if (!(a instanceof HTMLAnchorElement)) return;
      const name = eventForLink(a);
      if (name) sendSiteEvent(name, placeOf(a));
    };
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target instanceof HTMLFormElement ? e.target : null;
      if (!form || form.getAttribute('data-sd-form') === 'manual' || form.hasAttribute('data-sd-ignore')) return;
      sendSiteEvent('Form sent', placeOf(form));
    };
    document.addEventListener('click', onClick, { capture: true });
    document.addEventListener('submit', onSubmit, { capture: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      document.removeEventListener('submit', onSubmit, { capture: true });
    };
  }, []);
  return null;
}
