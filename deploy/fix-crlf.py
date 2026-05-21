#!/usr/bin/env python3
from pathlib import Path

deploy = Path(__file__).resolve().parent
paths = list(deploy.glob("*.sh")) + [deploy / "post-receive", deploy / "ports.env"]
for path in paths:
    if not path.is_file():
        continue
    data = path.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    path.write_bytes(data)
    print("fixed:", path.name)
