#!/bin/sh
set -xe

# # Set variable or default
# : "${BACKEND_URL:=http://localhost:4015}"
# : "${APP_NAME:=APPLICATION_NAME}"
# : "${APP_DESCRIPTION:=APPLICATION DESCRIPTION}"
#
# cat << EOF > /usr/share/nginx/html/assets/config/config.json
# {
#     "backendUrl": "${BACKEND_URL}",
#     "appName": "${APP_NAME}",
#     "appDescription": "${APP_DESCRIPTION}"
# }
# EOF

exec "$@"
