#!/bin/bash
# Double-cliquez sur ce fichier pour récupérer les illustrations libres.
cd "$(dirname "$0")"
echo "Continue ? — récupération des illustrations libres"
echo
python3 illustrations.py
echo
read -n 1 -s -r -p "Terminé. Appuyez sur une touche pour fermer."
