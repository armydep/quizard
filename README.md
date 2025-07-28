# quizard

1. install nodejs. 
the method of "sudo apt install nodejs npm" doesnt install the latest version 18 > that is required for Vite.

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install 22

2. docker run -d --name quizard-mongo -p 27017:27017 mongo:latest

3.

npm create vite@latest client -- --template react

cd client
npm install 
npm run dev
cd ..
cd server/
npm init -y
npm install express cors
npm install --save-dev @types/cors 
cd ..
npm install -D concurrently
npm install
npm run dev

Answer evaluator:
cd answer-evaluator
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

Run:
uvicorn app:app --host 0.0.0.0 --port 8000