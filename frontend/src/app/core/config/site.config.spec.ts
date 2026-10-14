import { siteConfig } from './site.config';

describe('siteConfig', () => {
  it('exposes the professional CRO registration', () => {
    expect(siteConfig.professional.registration).toBe('CRO-SP 145594');
  });

  it('builds a Google Maps embed URL from the configured address', () => {
    const url = siteConfig.address.mapsEmbedUrl;
    expect(url).toContain('google.com/maps');
    expect(url).toContain(encodeURIComponent('2411'));
  });

  it('marks unconfirmed services as such', () => {
    const anyUnconfirmed = siteConfig.services.some((s) => !s.confirmed);
    expect(anyUnconfirmed).toBeTrue();
  });
});
