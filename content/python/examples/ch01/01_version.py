# Confirm the OpenAlgo Python SDK is installed and check its version.
from importlib.metadata import version

import openalgo  # the OpenAlgo trading SDK

print("OpenAlgo SDK version:", version("openalgo"))
print("Imported from       :", openalgo.__file__)
