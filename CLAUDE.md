# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A pure frontend web tool for photovoltaic (PV) system component matching - queries inverter, junction box, and cable specifications based on region, module series, and quantity.

## Commands

No build or test commands needed. This is a single HTML file project.

- Development: Open `index.html` directly in browser
- Deploy: Push to GitHub, can be served via GitHub Pages

## Architecture

Single-file application (`index.html`) containing:

- **CSS**: Responsive design with CSS variables, mobile-first grid layout
- **HTML**: Form with 6 inputs (province/city/district dropdowns, ratio, series, module count)
- **JavaScript**:
  - `REGION_DB`: Regional configuration database mapping China administrative regions to inverter/box specs
  - `INV_DB`: Inverter specification lookup table
  - `cascadeUpdate()`: Handles 3-level dropdown cascade (province → city → district)
  - `queryMatch()`: Core matching logic - calculates inverter, copper wire, junction box, aluminum wire based on inputs
  - Data embedded as JS objects, no external dependencies

## Key Data Structures

- `REGION_DB`: `{ "省份-城市-区县": { b: "并网箱配置", r: "容配比要求" } }`
- `INV_DB`: Module series → power → count → inverter model mapping

## Git Workflow

Use SSH URL: `git@github.com:Ricardo-9877/pv-tool.git`