FROM mcr.microsoft.com/devcontainers/typescript-node:20

RUN apt-get update && \
    apt-get install -y openjdk-21-jdk wget unzip && \
    rm -rf /var/lib/apt/lists/*

ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p $ANDROID_HOME && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline.zip && \
    unzip -q cmdline.zip -d $ANDROID_HOME && \
    rm cmdline.zip

ENV PATH="$PATH:$ANDROID_HOME/cmdline-tools/bin"
RUN yes | sdkmanager --licenses >/dev/null

RUN corepack enable pnpm
