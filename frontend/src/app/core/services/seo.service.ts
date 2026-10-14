import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { siteConfig } from '../config/site.config';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly doc = inject(DOCUMENT);

  initRouteSync(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.collectDeepestData()),
      )
      .subscribe((data) => {
        const title = (data?.['title'] as string | undefined) ?? siteConfig.seo.defaultTitle;
        const description =
          (data?.['description'] as string | undefined) ?? siteConfig.seo.defaultDescription;
        this.applyTags(title, description);
      });
  }

  private collectDeepestData(): Record<string, unknown> | null {
    let route = this.activatedRoute.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data ?? null;
  }

  private applyTags(title: string, description: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    const canonical = `${environment.siteUrl.replace(/\/$/, '')}${this.router.url.split('?')[0]}`;
    this.setCanonicalUrl(canonical);
    this.meta.updateTag({ property: 'og:url', content: canonical });
  }

  private setCanonicalUrl(url: string): void {
    let link = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
