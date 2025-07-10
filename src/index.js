#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const yaml = __importStar(require("yaml"));
const path = __importStar(require("path"));
const semver = __importStar(require("semver"));
const program = new commander_1.Command();
program
    .version('0.0.1')
    .description('A Helm plugin to update Chart.yaml version.')
    .option('-c, --chart-path <path>', 'Path to the chart directory', '.')
    .option('--preid <identifier>', 'Identifier for prerelease versions (e.g., alpha, rc)')
    .argument('<part>', 'The part of the version to increment (major, minor, patch, premajor, preminor, prepatch, prerelease)')
    .action((part, options) => {
    const chartPath = path.join(options.chartPath, 'Chart.yaml');
    if (!fs.existsSync(chartPath)) {
        console.error(`Chart.yaml not found in ${options.chartPath}`);
        process.exit(1);
    }
    const chartFile = fs.readFileSync(chartPath, 'utf8');
    const chart = yaml.parse(chartFile);
    const version = chart.version || '0.1.0';
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
