# Reflect, Inspect, Correct

A module for FounryVTT to provide a user interface to allow reflecting on the state of invalid Documents, inspect the issue in detail, and ultimately correct it by resolving the issue or deleting the Document.

This module adds a user interface to inspect invalid Documents which you can find under the "Invalid Docuemnts" tab inside the "Support & Issues" Dialog accessible in the sidebar:

![WhereToFind](https://github.com/user-attachments/assets/f25d09df-fa5b-4e90-a809-1dc7954c5536)

Clicking the button indicated in the picture above will open the interface:

![grafik](https://github.com/user-attachments/assets/667ca702-3eaa-4309-b264-b58c94ed99a3)

Allowing for deletion of them

![grafik](https://github.com/user-attachments/assets/537cf61c-cc87-44ac-bdc9-d1db6ce0d53c)

Attempted automatic recovery

![grafik](https://github.com/user-attachments/assets/af45cd37-035d-42be-ac5a-6463cf9df2b1)

Aswell as manual recovery showing the current invalid values

![grafik](https://github.com/user-attachments/assets/09a6ba09-a487-46ab-9d7b-b4a8a217f3cc)

Do note that manual recovery is currently not supported for values within Arrays and Documents with a custom type offer no room for recovery, only deletion.
