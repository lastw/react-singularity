import { useState, useEffect } from 'react';
import { createAtomFactory, createSingularityFactory } from '../dist';

export const atom = createAtomFactory({ useState, useEffect });
export const singularity = createSingularityFactory({ useState, useEffect });

export const config = {
  concurrent: false,
  size: 40,
  replicas: 2,
  example: 'interactive-grid',
};

/**
 * /?concurrent=true&size=40&replicas=2
 */
const query = window.location.search.slice(1).split('&');

query.forEach((param) => {
  const [key, value] = param.split('=');

  switch (key) {
    case 'concurrent':
      config.concurrent = value === 'true';
      break;
    case 'size':
      config.size = Number(value) || config.size;
      break;
    case 'replicas':
      config.replicas = Number(value) || config.replicas;
      break;
    case 'example':
      config.example = value || config.example;
      break;
  }
});

export const buildQuery = (part: Partial<typeof config>) => {
  const c = {
    ...config,
    ...part,
  };

  return `?size=${c.size}&replicas=${c.replicas}&concurrent=${c.concurrent}&example=${c.example}`;
};
