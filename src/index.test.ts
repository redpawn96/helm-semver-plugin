import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('Helm Semver Plugin', () => {
  const chartDir = path.join(__dirname, 'test-chart');
  const chartPath = path.join(chartDir, 'Chart.yaml');

  beforeEach(() => {
    fs.mkdirSync(chartDir, { recursive: true });
    fs.writeFileSync(chartPath, 'apiVersion: v2\nname: test-chart\nversion: 1.2.3');
  });

  afterEach(() => {
    fs.rmSync(chartDir, { recursive: true, force: true });
  });

  it('should increment the patch version', () => {
    execSync(`ts-node ${path.join(__dirname, 'index.ts')} patch -c ${chartDir}`);
    const chart = fs.readFileSync(chartPath, 'utf8');
    expect(chart).toContain('version: 1.2.4');
  });

  it('should increment the minor version', () => {
    execSync(`ts-node ${path.join(__dirname, 'index.ts')} minor -c ${chartDir}`);
    const chart = fs.readFileSync(chartPath, 'utf8');
    expect(chart).toContain('version: 1.3.0');
  });

  it('should increment the major version', () => {
    execSync(`ts-node ${path.join(__dirname, 'index.ts')} major -c ${chartDir}`);
    const chart = fs.readFileSync(chartPath, 'utf8');
    expect(chart).toContain('version: 2.0.0');
  });

  it('should create a prerelease version', () => {
    execSync(`ts-node ${path.join(__dirname, 'index.ts')} prepatch --preid alpha -c ${chartDir}`);
    const chart = fs.readFileSync(chartPath, 'utf8');
    expect(chart).toContain('version: 1.2.4-alpha.0');
  });

  it('should increment a prerelease version', () => {
    fs.writeFileSync(chartPath, 'apiVersion: v2\nname: test-chart\nversion: 1.2.4-alpha.0');
    execSync(`ts-node ${path.join(__dirname, 'index.ts')} prerelease --preid alpha -c ${chartDir}`);
    const chart = fs.readFileSync(chartPath, 'utf8');
    expect(chart).toContain('version: 1.2.4-alpha.1');
  });
});
