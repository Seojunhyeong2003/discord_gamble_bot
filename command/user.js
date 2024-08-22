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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('유저')
        .setDescription('유저의 정보를 출력합니다.'),
    run: ({ interaction }) => {
        const username = interaction.user.username

        // JSON 파일 읽기
        const data = readJsonFile(filePath);

        // 사용자 정보 업데이트 또는 추가
        const userIndex = data.users.findIndex(user => user.id === interaction.user.id);
        if (userIndex !== -1) {
            // 사용자 정보 업데이트
            data.users[userIndex].username = username;
            data.users[userIndex].timestamp = new Date().toISOString();
        } else {
            // 새 사용자 추가
            const newUser = {
                id: interaction.user.id,
                username: username,
                timestamp: new Date().toISOString(),
                money: 0
            };
            data.users.push(newUser);
        }

        // JSON 파일 쓰기
        writeJsonFile(filePath, data);

        console.log(interaction.user);

        interaction.reply(`유저 아이디: ${interaction.user.username}\n글로벌 이름: ${interaction.user.globalName || '없음'}\n유저: ${interaction.user}`);
    },
};