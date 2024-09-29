#!/usr/bin/env node

import { install } from 'source-map-support';
import { fileURLToPath } from 'url';

install();

const __filename = fileURLToPath(import.meta.url);
const distPath = new URL('../dist/index.js', import.meta.url).pathname;

import(distPath);
