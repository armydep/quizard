# quizard

1. install nodejs. 
the method of "sudo apt install nodejs npm" doesnt install the latest version 18 > that is required for Vite.

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install 22


npm create vite@latest client -- --template react

cd client
npm install 
npm run dev
cd ..
cd server/
npm init -y
npm install express cors
cd ..
npm install -D concurrently
npm install
npm run dev