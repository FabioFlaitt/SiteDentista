/**
 * Configuração central do site — fonte única de verdade para dados profissionais,
 * contato e lista inicial de serviços. Edite aqui para refletir no site inteiro.
 *
 * IMPORTANTE: Nunca invente dados. Campos marcados com `confirmed: false`
 * aparecem como editáveis/placeholder no site.
 */

export interface ServiceDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  confirmed: boolean;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  confirmed: boolean;
}

export const siteConfig = {
  professional: {
    name: 'Dra. Bruna Naiara Molina',
    shortName: 'Dra. Bruna Molina',
    title: 'Cirurgiã-Dentista',
    registration: 'CRO-SP 145594',
    // TODO: validar biografia definitiva com a profissional.
    bioPlaceholder:
      'Atendimento odontológico com atenção à estética, saúde e funcionalidade do sorriso. ' +
      'Compromisso com acolhimento, escuta ativa e condutas baseadas em evidências.',
  },
  contact: {
    whatsappNumber: '5516997502033',
    whatsappDisplay: '(16) 99750-2033',
    whatsappUrl: 'https://wa.me/5516997502033',
    whatsappMessage:
      'Olá, Dra. Bruna! Gostaria de obter informações sobre uma consulta odontológica.',
    instagramHandle: '@drabrunamolina',
    instagramUrl: 'https://www.instagram.com/drabrunamolina/',
    linktreeUrl: 'https://linktr.ee/drabrunamolina',
  },
  address: {
    street: 'R. Voluntários da Pátria, 2411',
    neighborhood: 'Jardim Nova America',
    city: 'Araraquara',
    state: 'SP',
    postalCode: '14801-320',
    full: 'R. Voluntários da Pátria, 2411 - Jardim Nova America, Araraquara - SP, 14801-320',
    get mapsEmbedUrl(): string {
      const query = encodeURIComponent(
        'R. Voluntários da Pátria, 2411 - Jardim Nova America, Araraquara - SP, 14801-320',
      );
      return `https://www.google.com/maps?q=${query}&output=embed`;
    },
    get mapsRouteUrl(): string {
      const query = encodeURIComponent(
        'R. Voluntários da Pátria, 2411 - Jardim Nova America, Araraquara - SP, 14801-320',
      );
      return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    },
  },
  // TODO: validar horários de funcionamento com a profissional.
  businessHours: [
    { day: 'Segunda a Sexta', open: '00:00', close: '00:00', confirmed: false },
    { day: 'Sábado', open: '00:00', close: '00:00', confirmed: false },
  ] as BusinessHours[],
  services: [
    {
      id: 'cleaning',
      title: 'Limpeza e prevenção',
      description:
        'Avaliação, profilaxia e orientação de higiene bucal para manter a saúde do sorriso.',
      icon: 'sparkles',
      confirmed: false,
    },
    {
      id: 'implants',
      title: 'Implantes dentários',
      description: 'Reabilitação com planejamento individualizado — informações sob consulta.',
      icon: 'anchor',
      confirmed: false,
    },
    {
      id: 'ortho',
      title: 'Ortodontia',
      description: 'Correção do posicionamento dos dentes conforme indicação clínica.',
      icon: 'move',
      confirmed: false,
    },
    {
      id: 'whitening',
      title: 'Clareamento dental',
      description: 'Protocolos de clareamento com acompanhamento profissional.',
      icon: 'sun',
      confirmed: false,
    },
    {
      id: 'restorations',
      title: 'Restaurações',
      description:
        'Recuperação de dentes com cárie ou pequenas fraturas por meio de restaurações estéticas.',
      icon: 'wand-2',
      confirmed: false,
    },
    {
      id: 'urgency',
      title: 'Urgências odontológicas',
      description:
        'Atendimento de dor e intercorrências durante o horário do consultório — não é atendimento 24h.',
      icon: 'life-buoy',
      confirmed: false,
    },
  ] as ServiceDefinition[],
  seo: {
    siteName: 'Dra. Bruna Molina — Odontologia',
    defaultTitle: 'Dra. Bruna Molina — Cirurgiã-Dentista em Araraquara/SP',
    defaultDescription:
      'Dra. Bruna Naiara Molina (CRO-SP 145594). Atendimento odontológico com atenção à estética, saúde e funcionalidade do sorriso.',
  },
};

export type SiteConfig = typeof siteConfig;
