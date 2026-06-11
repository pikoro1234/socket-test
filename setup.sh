#!/bin/bash

# ─────────────────────────────────────────
# Security Gate - Setup automático
# Developer-SantaCole / security-workflows
# ─────────────────────────────────────────

echo ""
echo "🔐 Configurando Security Gate en tu proyecto..."
echo ""

# Verificar que estamos dentro de un repo git
if [ ! -d ".git" ]; then
  echo "❌ Error: Este script tiene que ejecutarse desde la raíz de tu proyecto."
  echo "   Navega a la carpeta de tu proyecto y vuelve a ejecutarlo."
  exit 1
fi

# Crear la estructura de carpetas
mkdir -p .github/workflows
echo "✅ Carpeta .github/workflows creada"

# Crear el archivo run-security.yml
cat > .github/workflows/run-security.yml << 'YAML'
name: 🔐 Run Security Gate

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security:
    uses: Developer-SantaCole/security-workflows/.github/workflows/security-gate.yml@main
    secrets: inherit
YAML

echo "✅ Archivo run-security.yml creado"

# Subir al repo
git add .github/workflows/run-security.yml
git commit -m "chore: add security gate pipeline"
git push

echo ""
echo "✅ ¡Listo! El Security Gate está activo en tu proyecto."
echo "   Cada vez que hagas push, GitHub revisará tu código automáticamente."
echo ""
