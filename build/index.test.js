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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
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
        (0, child_process_1.execSync)(`ts-node ${path.join(__dirname, 'index.ts')} patch -c ${chartDir}`);
        const chart = fs.readFileSync(chartPath, 'utf8');
        expect(chart).toContain('version: 1.2.4');
    });
    it('should increment the minor version', () => {
        (0, child_process_1.execSync)(`ts-node ${path.join(__dirname, 'index.ts')} minor -c ${chartDir}`);
        const chart = fs.readFileSync(chartPath, 'utf8');
        expect(chart).toContain('version: 1.3.0');
    });
    it('should increment the major version', () => {
        (0, child_process_1.execSync)(`ts-node ${path.join(__dirname, 'index.ts')} major -c ${chartDir}`);
        const chart = fs.readFileSync(chartPath, 'utf8');
        expect(chart).toContain('version: 2.0.0');
    });
    it('should create a prerelease version', () => {
        (0, child_process_1.execSync)(`ts-node ${path.join(__dirname, 'index.ts')} prepatch --preid alpha -c ${chartDir}`);
        const chart = fs.readFileSync(chartPath, 'utf8');
        expect(chart).toContain('version: 1.2.4-alpha.0');
    });
    it('should increment a prerelease version', () => {
        fs.writeFileSync(chartPath, 'apiVersion: v2\nname: test-chart\nversion: 1.2.4-alpha.0');
        (0, child_process_1.execSync)(`ts-node ${path.join(__dirname, 'index.ts')} prerelease --preid alpha -c ${chartDir}`);
        const chart = fs.readFileSync(chartPath, 'utf8');
        expect(chart).toContain('version: 1.2.4-alpha.1');
    });
});
