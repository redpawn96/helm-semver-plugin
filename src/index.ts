#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';
import * as semver from 'semver';

const program = new Command();

program
  .version('0.0.1')
  .description('A Helm plugin to update Chart.yaml version.')
  .option('-c, --chart-path <path>', 'Path to the chart directory', '.')
  .option('--preid <identifier>', 'Identifier for prerelease versions (e.g., alpha, rc)')
  .argument('<part>', 'The part of the version to increment (major, minor, patch, premajor, preminor, prepatch, prerelease)')
  .action((part: semver.ReleaseType, options) => {
    const chartPath = path.join(options.chartPath, 'Chart.yaml');
    if (!fs.existsSync(chartPath)) {
      console.error(`Chart.yaml not found in ${options.chartPath}`);
      process.exit(1);
    }

    const chartFile = fs.readFileSync(chartPath, 'utf8');
    const chart = yaml.parse(chartFile);

    const version: string = chart.version || '0.1.0';

    const newVersion = semver.inc(version, part, options.preid);

    if (!newVersion) {
      console.error(`Could not increment version '${version}' by '${part}'.`);
      process.exit(1);
    }

    chart.version = newVersion;
    fs.writeFileSync(chartPath, yaml.stringify(chart));
    console.log(`Updated chart version to ${newVersion}`);
  });

program.parse(process.argv);