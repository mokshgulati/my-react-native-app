# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

================================================================

## Personal Notes to get the project running (New and Old one):-



1. To create a new Expo project, run the following command:
	```
	npx create-expo-app@latest
	```

2. For macOS -- (run following commands and install):
	```
	brew install watchman
	brew install --cask zulu@17
	```

3. After you install the JDK, add the JAVA_HOME environment variable in ~/.bash_profile (or ~/.zshrc if you use Zsh):
	```
    export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
	```

4. Then setup Android studio: (see documentation of react native docs)

5. Set up emulator:  From "More Actions", open "Virtual Device Manager", click "Create device", select hardware(screen sizes) & Select "Tiramisu"(Release Name) form    recommended tab and download & finish the emulator setup.

6. Running the app on emulator:
    *Run following commands:
    ```
      npx expo install expo-dev-client
      npx expo run / npx expo run:android
      select "a" for android or select "i" for iphone.
    ```

7. Then start developing your app and code.
	```
	npx expo start
	```


***** Building APK: (For macOS):

1. Open Desktop in terminal.

2. Generating upload key (keystore file):
   run the following cammand:
    sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
      
   (Here change the keystore file name instead of this "my-upload-key.keystore", change name as you want, and alias name &  remember both alias name and file name)

3. Then this command prompts you for passwords for the keystore and key and for the Distinguished Name fields for your key. It then generates the keystore as a file called        my-upload-key.keystore. (remeber the keystore password).

4. Setting up Gradle variables:
    * Place the my-upload-key.keystore file under the android/app directory in your project folder.
    * Edit the file ~/.gradle/gradle.properties, and add the following:

      MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
      MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
      MYAPP_UPLOAD_STORE_PASSWORD=your-keystore-password
      MYAPP_UPLOAD_KEY_PASSWORD=your-key-password

5. Adding signing config to your app's Gradle config:
    * Edit the file android/app/build.gradle in your project folder, and add the signing config:
       ...
       android {
         ...
         defaultConfig { ... }
         signingConfigs {
           release {
               if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                  storeFile file(MYAPP_UPLOAD_STORE_FILE)
                  storePassword MYAPP_UPLOAD_STORE_PASSWORD
                  keyAlias MYAPP_UPLOAD_KEY_ALIAS
                  keyPassword MYAPP_UPLOAD_KEY_PASSWORD
               }
            }
         }
         buildTypes {
           release {
              ...
              signingConfig signingConfigs.release
           }
         }
      }
     ...

6. Generating the release apk:
   * go to android folder from terminal:
      cd android
   * run the cammand:
     ./gradlew clean
     ./gradlew assembleRelease
   * cd ..
   * then the apk file is generated and apk file location: /android/app/build/outputs/apk/realese/app-release.apk

7. Enabling Proguard to reduce the size of the APK (optional):
    * To enable Proguard, edit android/app/build.gradle:
       /**
        * Run Proguard to shrink the Java bytecode in release builds.
       */
      def enableProguardInReleaseBuilds = true

8. Generating the release AAB:
   Run the following command in a terminal:
    npx react-native build-android --mode=release
   (This command uses Gradle's bundleRelease under the hood that bundles all the JavaScript needed to run your app into the AAB (Android App Bundle).)
   The generated AAB can be found under android/app/build/outputs/bundle/release/app-release.aab, and is ready to be uploaded to Google Play.