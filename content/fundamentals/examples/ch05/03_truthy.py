# Every value is "truthy" or "falsy" when Python treats it as a yes/no.
print("Is 0 truthy?    ", bool(0))          # False - zero is falsy
print("Is 100 truthy?  ", bool(100))        # True  - any other number
print("Empty text?     ", bool(""))         # False - an empty string is falsy
print("Some text?      ", bool("RELIANCE")) # True  - any non-empty string
