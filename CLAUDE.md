# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

Build command runs TypeScript compilation followed by Vite build.

## Architecture Overview

This is a React + TypeScript + Vite application for creating interactive charts and dashboards. The architecture follows a modular component-based design with clear separation of concerns.

### Core Data Flow
- **IndexedDB persistence**: Charts and dashboards are persisted using `databaseService` with IndexedDB
- **Hooks-based state management**: Custom hooks manage data, settings, and UI state
- **Universal chart rendering**: `UniversalChartRenderer` component handles all chart types through a unified interface

### Chart System
The application supports multiple chart types through a unified data model:
- **Waterfall charts**: Primary chart type with stacked segments support
- **Sankey diagrams**: Node-link visualizations with custom layout algorithms  
- **Stacked bar charts**: Using Recharts library
- **Line/Area charts**: Time series and continuous data visualization

All charts share common interfaces (`ChartData`, `ChartSettings`, `DataRow`) but have type-specific configurations.

### Data Management
- **Import/Export**: Universal importer supports CSV, Excel, JSON formats with validation
- **Template system**: Predefined data templates for different chart types
- **Real-time validation**: Client-side data validation with user feedback

### Routing Structure
- `/` - Home page
- `/charts` - Charts listing and management
- `/charts/new` - Chart creation
- `/charts/:id` - Chart viewer
- `/charts/:id/edit` - Chart editor
- `/dashboards` - Dashboard listing
- `/dashboards/new` - Dashboard builder
- `/dashboards/:id` - Dashboard viewer with grid layout

### Key Components
- **Layout**: Main application shell with navigation
- **UniversalChartRenderer**: Renders any chart type based on data and settings
- **ConfigModal**: Universal configuration interface for all chart types
- **DashboardBuilder**: Grid-based dashboard layout system
- **Universal importers**: Chart-specific data import components

### Services Layer
- **databaseService**: IndexedDB operations for charts and dashboards persistence
- **dataValidationService**: Client-side data validation and transformation
- **exportService**: Chart export functionality (PNG, SVG, data formats)
- **templateService**: Data template management

### Styling and UI
- **Tailwind CSS**: Utility-first styling with custom configuration
- **Responsive design**: Mobile-first approach with grid layouts
- **Lucide React**: Icon system
- **Theme support**: Built-in theme switching capabilities

## Type System

The application uses a comprehensive TypeScript type system centered around:
- `DataRow`: Core data structure for all chart types
- `ChartSettings`: Universal settings with chart-specific extensions
- `ChartData`: Union type containing data for all supported chart types
- `SavedChart`/`Dashboard`: Persistence layer types

## Development Notes

- Components are organized by chart type in subdirectories (waterfall/, sankey/, etc.)
- Each chart type has its own config, import, and core rendering components
- Hooks provide data management and are reusable across components
- The codebase uses crypto.randomUUID() for ID generation
- IndexedDB is initialized automatically and handles schema migrations