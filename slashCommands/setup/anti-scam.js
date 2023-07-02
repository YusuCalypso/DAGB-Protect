const { ApplicationCommandType, EmbedBuilder, RoleSelectMenuBuilder, ActionRowBuilder, ComponentType, ChannelSelectMenuBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
var DB = require('../../Models/anti-scam.js')


module.exports = {
  name: 'anti-scam',
  description: "Setup or disable anti scam.",
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: 'ManageGuild',
  cooldown: 3000,
  options: [
    {
      name: 'option',
      description: 'Please select what to do.',
      type: 3,
      required: true,
      choices: [
        {
          name: "Setup/Configure anti scam.",
          value: "st_con"
        },
        {
          "name": "Disable anti scam.",
          "value": "disable"
        }
      ],
    }
  ],
  run: async (client, interaction) => {
    try {
      const choice = interaction.options.getString('option')

      switch (choice) {
        case "st_con":
          const row = new ActionRowBuilder()
            .addComponents(
              new ChannelSelectMenuBuilder({
                custom_id: 'channel_select_4',
                placeholder: 'select a channel.',
                max_values: 1,
              }),
            )

          const messageEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Setup Anti Scam (step 1 of 1)')
            .setDescription('Please select a channel where all the logs will go.')

          const row2 = new ActionRowBuilder()
            .addComponents(
              new RoleSelectMenuBuilder({
                custom_id: 'select_expired_3',
                placeholder: 'Times up.',
                max_values: 1,
                disabled: true,
              }),
            )

          interaction.reply({ embeds: [messageEmbed], components: [row] }).then(time => {
            setTimeout(() => {
              interaction.editReply({
                components: [row2]
              }).catch(console.log)
            }, "60000")
          })

          //////////////////////////////////////// CHANNEL SELECT ////////////////////////////////////////////////
          const collector2 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.ChannelSelect, time: 70000 });

          collector2.on('collect', async i => {

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }
            const id = i.channels.first().id

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.Channel = id
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                  Channel: id
                }).save();
              }


              const messageEmbed2 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Scam setup has been complete!')
                .setDescription(`AntiSystem will now listen for Scam links and delete them.\n\n**Logs: <#${id}>**`)

              await i.update({ embeds: [messageEmbed2], components: [] }).catch(console.log)
              collector2.stop()
            })
          });
          collector2.on('end', collected => {

            console.log(`Collected`);
          })

          //////////////////////////////////////////////////////////////////////////////////////////
          break;
        case "disable":

          const errornodata = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Anti Scam can not be disabled.')
            .setDescription(`Anti Scam has already been disabled!`)

          DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (!data) {
              interaction.reply({ embeds: [errornodata] })
            } else {
              const messageEmbed5 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Are you sure you want to continue?')
                .setDescription(`All of the setup progress will be lost and AntiSystem will no longer listen for scam links.`)

              const row5 = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('continue_anti_scam')
                    .setLabel('Continue')
                    .setStyle(ButtonStyle.Danger),
                );

              const row_disabled_btn = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('continue_anti_scam_disabled')
                    .setLabel('Continue')
                    .setDisabled()
                    .setStyle(ButtonStyle.Danger),
                );

              interaction.reply({ embeds: [messageEmbed5], components: [row5] }).then(time => {
                setTimeout(() => {
                  interaction.editReply({
                    components: [row_disabled_btn]
                  }).catch(console.log)
                }, "60000")
              })

              const collector13 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 70000 });

              collector13.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                  await DB.deleteOne({ Guild: interaction.guild.id })

                  const messageEmbed15 = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`Anti Scam has been disabled.`)
                    .setDescription(`Action by <@${i.user.id}>`)

                  i.update({ embeds: [messageEmbed15], components: [] });
                } else {
                  i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                }
              });

              collector13.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
              });
            }
          })
          
          break;
      }

    } catch (err) {
      const error = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle(`Error!`)
        .setDescription(`Error.\n${err}\n\n**for further support go to https://antisystem.xyz/contact**`)
        .setFooter({ text: 'AntiSystem', iconURL: 'https://antisystem.xyz/assets1/img/logo.webp' });

      interaction.reply({
        embeds: [error]
      }).catch(console.log)

    }
  }
};