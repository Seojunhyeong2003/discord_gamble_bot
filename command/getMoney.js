const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

// JSON 파일 경로
const filePath = path.join(__dirname, '../user_data.json');

// JSON 파일 읽기 함수
function readJsonFile(filePath) {
    const fullPath = path.resolve(filePath);
    const jsonData = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(jsonData);
}

// JSON 파일 쓰기 함수
function writeJsonFile(filePath, data) {
    const fullPath = path.resolve(filePath);
    const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON with 2 spaces
    fs.writeFileSync(fullPath, jsonData, 'utf-8');
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('돈받기')
        .setDescription('1000 ~ 5000원 사이의 돈을 랜덤으로 받게됩니다.'),
    run: ({ interaction }) => {
        const username = interaction.user.username;
        const getMoneyValue = rand(1000, 5000);
        const now = new Date();

        // JSON 파일 읽기
        const data = readJsonFile(filePath);

        // 사용자 정보 업데이트 또는 추가
        const userIndex = data.users.findIndex(user => user.id === interaction.user.id);
        if (userIndex !== -1) {
            // 사용자 정보 업데이트
            const lastGetMoneyTime = new Date(data.users[userIndex].get_money_time);

            // 20초가 지났는지 확인
            const diffMs = now - lastGetMoneyTime;
            const diffSecs = Math.floor(diffMs / 1000);
            const remainingSecs = 10 - diffSecs;
            if (diffSecs < 10) {
                interaction.reply(`10초가 지나지 않았습니다.\n남은 시간: ${remainingSecs}초`);
                return;
            }

            data.users[userIndex].username = username;
            data.users[userIndex].timestamp = now.toISOString();
            data.users[userIndex].get_money_time = now.toISOString();
            data.users[userIndex].money += getMoneyValue;
        } else {
            // 새 사용자 추가
            const newUser = {
                id: interaction.user.id,
                username: username,
                timestamp: now.toISOString(),
                get_money_time: now.toISOString(),
                money: getMoneyValue
            };
            data.users.push(newUser);
        }

        // JSON 파일 쓰기
        writeJsonFile(filePath, data);

        interaction.reply(`${getMoneyValue}원 의 돈을 받았습니다.`);
    },
};
