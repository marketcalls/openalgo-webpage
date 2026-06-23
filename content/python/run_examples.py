"""Run every example .py in a chapter folder, capture output to a .out sidecar,
and report pass/fail. Examples read OPENALGO_API_KEY / OPENALGO_HOST from the env.

Run from the repo's Python workspace (uv resolves the venv from D:\\Quantflow4\\Day14):
    uv run python openalgo-webpage/content/python/run_examples.py 5
    uv run python openalgo-webpage/content/python/run_examples.py all
"""
import os
import subprocess
import sys
from pathlib import Path

EXAMPLES = Path(__file__).parent / "examples"

API_KEY = "40ebaa22a867e5fefd8d582305d544c59eb511953eba0eea838e17fecfca7751"
HOST = "http://127.0.0.1:5000"
WS = "ws://127.0.0.1:8765"
MAX_CHARS = 3500
TIMEOUT = 150


def run_one(py: Path):
    env = {**os.environ, "OPENALGO_API_KEY": API_KEY, "OPENALGO_HOST": HOST,
           "OPENALGO_WS_URL": WS, "MPLBACKEND": "Agg", "PYTHONWARNINGS": "ignore"}
    try:
        r = subprocess.run([sys.executable, str(py)], capture_output=True, text=True,
                           timeout=TIMEOUT, env=env, cwd=str(py.parent))
        out = (r.stdout or "") + (("\n[stderr]\n" + r.stderr) if r.returncode and r.stderr else "")
        ok = r.returncode == 0
    except subprocess.TimeoutExpired:
        out, ok = f"[TIMEOUT after {TIMEOUT}s]", False
    except Exception as e:  # noqa: BLE001
        out, ok = f"[RUNNER ERROR] {e}", False
    out = out.strip()
    if len(out) > MAX_CHARS:
        out = out[:MAX_CHARS] + "\n... [output truncated]"
    py.with_suffix(".out").write_text(out, encoding="utf-8")
    return ok, out


def main():
    args = sys.argv[1:] or ["all"]
    if args == ["all"]:
        folders = sorted(p for p in EXAMPLES.iterdir() if p.is_dir())
    else:
        folders = [EXAMPLES / f"ch{int(a):02d}" for a in args]
    total = fails = 0
    for folder in folders:
        if not folder.exists():
            print(f"!! {folder.name}: no folder"); continue
        pys = sorted(folder.glob("*.py"))
        print(f"\n=== {folder.name} ({len(pys)} examples) ===")
        for py in pys:
            total += 1
            ok, out = run_one(py)
            first = out.splitlines()[0] if out else "(no output)"
            print(f"  [{'OK ' if ok else 'FAIL'}] {py.name:32s} {first[:80]}")
            if not ok:
                fails += 1
    print(f"\n{total - fails}/{total} passed, {fails} failed.")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
