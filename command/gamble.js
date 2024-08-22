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
        .setName('올인')
        .setDescription('50% 확률로 2배의 금액을 획득합니다.'),
    run: ({ interaction }) => {
        // JSON 파일 읽기
        const data = readJsonFile(filePath);

        // 사용자 정보 업데이트 또는 추가
        const userIndex = data.users.findIndex(user => user.id === interaction.user.id);
        if (userIndex !== -1) {
            if (data.users[userIndex].money < 1000) {
                interaction.reply(`보유금액이 1000원 이하 입니다.`);
            } else {
                let ranValue = rand(1,10);
                if(ranValue > 5) {
                    data.users[userIndex].money *= 2;
                } else {
                    data.users[userIndex].money = 0;
                }
            }
        } else {
            interaction.reply(`유저 정보가 없습니다.\n/돈받기 또는 /유저 를 입력하여 유저 정보를 등록하세요`);
        }

        // JSON 파일 쓰기
        writeJsonFile(filePath, data);
    },
};
