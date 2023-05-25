const { MessageEmbed, MessageButton } = require('discord.js');

module.exports = {
    data: {
        name: 'akinator',
        description: 'Joue au jeu Akinator avec le bot',
    },
    async execute(interaction) {
        const { member, channel } = interaction;

        // Questions et réponses possibles
        const questions = [
            'Est-ce un animal ?',
            'Est-ce un objet ?',
            'Est-ce une personne célèbre ?',
            'Est-ce un personnage de fiction ?',
        ];
        const responses = {
            animal: ['Chien', 'Chat', 'Lion', 'Oiseau'],
            objet: ['Téléphone', 'Chaise', 'Voiture', 'Ordinateur'],
            celebrite: ['Albert Einstein', 'Leonardo da Vinci', 'Marie Curie', 'William Shakespeare'],
            fiction: ['Harry Potter', 'Luke Skywalker', 'Sherlock Holmes', 'Hermione Granger'],
        };

        let currentQuestionIndex = 0;
        let currentQuestion = questions[currentQuestionIndex];
        let currentAnswers = responses.animal;

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Akinator')
            .setDescription(currentQuestion)
            .addField('Réponses possibles:', currentAnswers.join(', '));

        const gameMessage = await channel.send({ embeds: [embed] });

        while (currentQuestionIndex < questions.length) {
            const filter = m => m.author.id === member.id;
            const userResponse = await channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const userMessage = userResponse.first();
            userMessage.delete();

            const userAnswer = userMessage.content.toLowerCase();
            const isValidAnswer = currentAnswers.includes(userAnswer);

            if (isValidAnswer) {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    currentQuestion = questions[currentQuestionIndex];
                    currentAnswers = responses[Object.keys(responses)[currentQuestionIndex]];
                    embed.setDescription(currentQuestion);
                    embed.fields = [];
                    embed.addField('Réponses possibles:', currentAnswers.join(', '));
                    await gameMessage.edit({ embeds: [embed] });
                } else {
                    await channel.send('J\'ai deviné !');
                }
            } else {
                await channel.send('Veuillez fournir une réponse valide.');
            }
        }
    },
};
