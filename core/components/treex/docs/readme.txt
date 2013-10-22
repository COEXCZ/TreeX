@package treex

Creator: COEX CZ (info@coex.cz), 2013 


INFORMATION:
Frontend Tree of MODX resources


Enable users loging via Login EXTRA:
Place "injectMgr" snippet after "Login" snippet.

[[!Login]]
[[!injectMgr]]


How to show only resources assigned via MODX ACL management:

Create new "Resource groups"
Add documents into "New resource groups"
Create a "new Access policy" using "frontend-editor.policy.xml" (Frontend Editor)
Create a "New user group"
Add users into "New user group.
In "New group" add content access for both web and mgr content (Member - 9999, Frontend Editor)
In "New group"in "Resource group access" define access for allowed resource group (Member-9999, Resource, mgr) and prohibit access for prohibited resource groups (Super User - 0, Resource, mgr)
