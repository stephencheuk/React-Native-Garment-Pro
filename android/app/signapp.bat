rem set path with C:\Program Files\Java\jdk1.8.0_66\bin
xcopy /y build\outputs\apk\app-x86-release-unsigned.apk build\outputs\apk\app-x86-release.apk
xcopy /y build\outputs\apk\app-universal-release-unsigned.apk build\outputs\apk\app-universal-release.apk
xcopy /y build\outputs\apk\app-armeabi-v7a-release-unsigned.apk build\outputs\apk\app-armeabi-v7a-release.apk

"C:\Program Files\Java\jdk1.8.0_66\bin\jarsigner.exe" -verbose -keystore my-release-key.keystore build\outputs\apk\app-x86-release.apk my-key-alias
"C:\Program Files\Java\jdk1.8.0_66\bin\jarsigner.exe" -verbose -keystore my-release-key.keystore build\outputs\apk\app-universal-release.apk my-key-alias
"C:\Program Files\Java\jdk1.8.0_66\bin\jarsigner.exe" -verbose -keystore my-release-key.keystore build\outputs\apk\app-armeabi-v7a-release.apk my-key-alias
