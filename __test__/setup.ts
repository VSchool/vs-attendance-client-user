import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";
import '../__mocks__/globals';

expect.extend(matchers);

afterEach(() => {
    cleanup();
});

Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '' },
});

