@ECHO OFF

SET current_dir=%CD%
SET project_dir=%current_dir%\..
SET files=%project_dir%\epic.js %project_dir%\tools.js

SET config=%1
SET version=%2

SET output=%project_dir%\build\epic.%version%

AjaxMin.exe -JS -clobber -term -pretty -braces:same %files% -out %output%.js

AjaxMin.exe -JS -clobber -term %files% -out %output%.min.js
