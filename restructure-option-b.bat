@echo off
REM ========================================
REM RESTRUCTURATION phone-help-code
REM Option B : phone-help/ + tele-consultation/
REM ========================================

echo.
echo ===============================================
echo   RESTRUCTURATION phone-help-code - Option B
echo ===============================================
echo.

cd /d "%~dp0"

REM Vérifier qu'on est dans phone-help-code
if not exist "wpcode-snippets" (
    echo ERREUR: wpcode-snippets introuvable
    echo Veuillez executer ce script dans le dossier phone-help-code
    pause
    exit /b 1
)

echo [1/5] Creation structure phone-help/...
mkdir wpcode-snippets\phone-help 2>nul
mkdir wpcode-snippets\phone-help\qualif-cardio 2>nul
mkdir wpcode-snippets\phone-help\qualif-pneumo 2>nul
mkdir wpcode-snippets\phone-help\tools 2>nul
mkdir wpcode-snippets\phone-help\fixes 2>nul

echo [2/5] Deplacement fichiers phone-help...
move wpcode-snippets\qualif-cardio\*.js wpcode-snippets\phone-help\qualif-cardio\ >nul 2>&1
move wpcode-snippets\qualif-pneumo\*.js wpcode-snippets\phone-help\qualif-pneumo\ >nul 2>&1
move wpcode-snippets\tools\*.js wpcode-snippets\phone-help\tools\ >nul 2>&1
move wpcode-snippets\fixes\*.js wpcode-snippets\phone-help\fixes\ >nul 2>&1

echo [3/5] Suppression anciens dossiers vides...
rmdir /s /q wpcode-snippets\qualif-cardio 2>nul
rmdir /s /q wpcode-snippets\qualif-pneumo 2>nul
rmdir /s /q wpcode-snippets\tools 2>nul
rmdir /s /q wpcode-snippets\fixes 2>nul

echo [4/5] Creation structure tele-consultation/...
mkdir wpcode-snippets\tele-consultation 2>nul

echo [5/5] Telechargement tele-consultation depuis Claude...
echo ATTENTION: Telecharge manuellement les 3 fichiers .js depuis Claude:
echo   - client-paiement.js
echo   - client-consultation.js
echo   - admin-dashboard.js
echo.
echo Et place-les dans: wpcode-snippets\tele-consultation\
echo.

echo ===============================================
echo   STRUCTURE CIBLE:
echo ===============================================
echo.
echo wpcode-snippets/
echo   ^|-- phone-help/
echo   ^|     ^|-- qualif-cardio/     (2 fichiers)
echo   ^|     ^|-- qualif-pneumo/     (4 fichiers)
echo   ^|     ^|-- tools/             (1 fichier)
echo   ^|     ^|-- fixes/             (1 fichier)
echo   ^|
echo   ^|-- tele-consultation/
echo         ^|-- client-paiement.js
echo         ^|-- client-consultation.js
echo         ^|-- admin-dashboard.js
echo.

echo ===============================================
echo   ETAPES SUIVANTES:
echo ===============================================
echo.
echo 1. Telecharge les 3 .js depuis Claude
echo 2. Place-les dans wpcode-snippets\tele-consultation\
echo 3. Remplace README.md avec celui de Claude
echo 4. Git add + commit + push
echo.
echo Commandes Git:
echo   git add .
echo   git commit -m "📦 Restructuration Option B - phone-help + tele-consultation"
echo   git push origin main
echo.

pause
