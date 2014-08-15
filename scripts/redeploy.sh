#!/bin/bash
CURR_MEM_USED=0
MEM_LIMIT=5900000
while true
do
  CURR_MEM_USED=`free | awk '/^Mem:/{print $3}'`
  if [[ "$CURR_MEM_USED" -gt "$MEM_LIMIT" ]]; then
    echo "hit the limit $MEM_LIMIT used: $CURR_MEM_USED"
    fab production redeploy:production
  fi
  sleep 60
done