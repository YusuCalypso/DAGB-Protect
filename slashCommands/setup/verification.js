const { ApplicationCommandType, EmbedBuilder, RoleSelectMenuBuilder, ActionRowBuilder, ComponentType, ChannelSelectMenuBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
var VerificationModel = require('../../Models/verification.js')


module.exports = {
	name: 'verification-setup',
	description: "Setup Verification!",
	type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ManageGuild',
	cooldown: 3000,
	run: async (client, interaction) => {

    try {
    const row = new ActionRowBuilder()
			.addComponents(
	 new RoleSelectMenuBuilder({
	custom_id: 'role_select',
	placeholder: 'select a role.',
	max_values: 1,
}),
  )

     const row2 = new ActionRowBuilder()
			.addComponents(
	 new RoleSelectMenuBuilder({
	custom_id: 'role_select_expired',
	placeholder: 'Times up.',
	max_values: 1,
  disabled:true,
}),
  )

    const messageEmbed = new EmbedBuilder()
  .setColor(0xFF0000)
	.setTitle('Setup Verification (step 1/3)')
	.setDescription('Please select a role to add to a user once they verify.')
	.setImage('https://images-ext-2.discordapp.net/external/F-nlC4KJFZAtlgMauMMU1nWevowd68xn9F7YC7dGvgg/https/i.ibb.co/9W6hN4g/Discord-NVog-Zd-QDDX.png')
	

    


       const mess4ageEmbed = new EmbedBuilder()
      .setTitle('Setup Cancelled!')
      .setDescription('Please do the setup process in under 1 minute.')
      .setColor(0xFF0000)
    
    await interaction.reply({
      components: [row],
      embeds: [messageEmbed]
    }).then(time => {
   setTimeout(() => {
  interaction.editReply({
    components: [row2]
  }).catch(console.log)
}, "60000")
})
    .catch(console.log)


    //////////////////////////////////////// ROLE SELECT HANDLING ///////////////////////////////////////////////
    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.RoleSelect, time: 70000 });

collector.on('collect', async i => {
  if(i.user.id !== interaction.user.id) {
        return i.reply({content: "This select menu is not for you!", ephemeral: true })
      }
  
  const role1 = i.roles.first().id
  

    let myRole = interaction.guild.roles.cache.get(role1);


    if(myRole.position > interaction.guild.members.me.roles.highest.position) {
       const errorembed1 = new EmbedBuilder()
  .setColor(0xFF0000)
	.setTitle('Error!')
	.setDescription(`Please make me higher than <@&${role1}> else i wont be able to give people that role.`)
      await i.update({ embeds: [errorembed1], components: [] }).catch(console.log)
      collector.stop() 
    } else {


  const messageEmbed1 = new EmbedBuilder()
  .setColor(0xFF0000)
	.setTitle('Setup Verification (step 2/3)')
	.setDescription(`Please select a channel to send the verification embed to.\n**Role:** <@&${role1}>.`)
  
  VerificationModel.findOne({ Guild: interaction.guild.id }, async (err, data) => {
          if (data) data.delete()
          new VerificationModel({
        Guild: interaction.guild.id,
        Channel: "None",
        Type: "None", 
        Role: role1
          }).save();
        })

      const row1 = new ActionRowBuilder()
			.addComponents(
	 new ChannelSelectMenuBuilder({
	custom_id: 'channel_select',
	placeholder: 'select a channel.',
	max_values: 1,
}),
  )
    console.log('test')
    await i.update({ embeds: [messageEmbed1], components: [row1] }).catch(console.log)

      collector.stop()
    }
});
collector.on('end', collected => {
  
  console.log(`Collected`);
  })

/////////////////////////////////////////////// END OF ROLE SELECT HANDLING ///////////////////////////////////

////////////////////////////////////////////// CHANNEL SELECT HANDLING ///////////////////////////////////////
     const collector2 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.ChannelSelect, time: 70000 });

    collector2.on('collect', async i => {
      if(i.user.id !== interaction.user.id) {
        return i.reply({content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
      }
  const id = i.channels.first().id
  
  VerificationModel.findOne({ Guild: interaction.guild.id }, async (err, data) => {
          if (data) {
          data.Channel = id
          data.Guild = interaction.guild.id
          data.save()
            }
      

     const messageEmbed2 = new EmbedBuilder()
  .setColor(0xFF0000)
	.setTitle('Setup Verification (step 3/3)')
	.setDescription(`Please select the type of verification.\n\n**For help go to https://antisystem.xyz/verification-types.**\n\n**Role:** <@&${data.Role}>.\n**Channel: **<#${id}>`)

    const row3 = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('type')
					.setPlaceholder('Nothing selected')
					.setMaxValues(1)
					.addOptions([
						{
							label: 'One Click',
							description: `The user will just have to click 1 button.`,
              emoji: "<:electric:1039946152415596644>",
							value: 'one_click',
						},
						{
							label: 'Site Captcha',
							description: 'The user will have to complete a captcha on our site.',
              emoji: "<:site:1048322956931117106>",
							value: 'site_captcha',
						},
						{
							label: 'Modal Captcha',
							description: 'The user will have to enter a code.',
              emoji: "<:about_me:1039948012459409428>",
							value: 'modal_captcha',
						},
					]),
			);

     await i.update({ embeds: [messageEmbed2], components: [row3] }).catch(console.log)
    collector2.stop()
        })
});
collector2.on('end', collected => {
  
  console.log(`Collected`);
  })
    
//////////////////////////////////////////// END OF CHANNEL SELECT HANDLING /////////////////////////////////


////////////////////////////////////////// BEGIN OF HANDLING OPTIONS //////////////////////////////////////
         const collector3 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 70000 });

    collector3.on('collect', async i => {
      if(i.user.id !== interaction.user.id) {
        return i.reply({content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
      }
  const value = i.values[0]
  
  VerificationModel.findOne({ Guild: interaction.guild.id }, async (err, data) => {
          if (data) {
          data.Type = value
          data.Guild = interaction.guild.id
          data.save()
            }

     const messageEmbed2 = new EmbedBuilder()
  .setColor(0xFF0000)
	.setTitle('Verification has been setup <:correct:1039807067562709074>')
	.setDescription(`**Role:** <@&${data.Role}>.\n**Channel: **<#${data.Channel}>\n**Type:** ${value}\n\n**Check <#${data.Channel}>**`)

     const messageEmbed4 = new EmbedBuilder()
  .setColor(0xFF0000)
	.setTitle(`Verification for ${i.guild.name}`)
  .setDescription(`Please click the verify button below then follow the steps to get <@&${data.Role}>!`)
  .setFooter({ text: 'AntiSystem', iconURL: 'https://antisystem.xyz/assets1/img/logo.webp' });

    	const verifybutton = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`${interaction.guild.id}-${value}`)
					.setLabel('Verify')
					.setStyle(ButtonStyle.Success),
			);


     await i.update({ embeds: [messageEmbed2], components: [] }).catch(console.log)
     await client.channels.cache.get(data.Channel).send({embeds: [messageEmbed4], components: [verifybutton]})
        })
      collector3.stop()
});
collector3.on('end', collected => {
  
  console.log(`Collected`);
  })

///////////////////////////////////////////////// END OF HANDLING OPTIONS //////////////////////////////////////
    } catch(err) {
       const error = new EmbedBuilder()
  .setColor(0xFF0000)
	.setTitle(`Error!`)
  .setDescription(`Please check that I have permissions to send messages to the verify channel.\n\n**for further support go to https://antisystem.xyz/contact**`)
  .setFooter({ text: 'AntiSystem', iconURL: 'https://antisystem.xyz/assets1/img/logo.webp' });
      
      interaction.editReply({
    embeds: [error]
  }).catch(console.log)
    }
	}
};