const { ApplicationCommandType, EmbedBuilder, RoleSelectMenuBuilder, ActionRowBuilder, ComponentType, ChannelSelectMenuBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder } = require('discord.js');
var DB = require('../../Models/anti-ghost-ping.js')


module.exports = {
  name: 'anti-ghost-ping',
  description: "Setup or disable anti ghost ping.",
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: 'ManageGuild',
  cooldown: 10000,
  options: [
    {
      name: 'option',
      description: 'Please select what to do.',
      type: 3,
      required: true,
      choices: [
        {
          name: "Setup/Configure anti ghost ping.",
          value: "st_con"
        },
        {
          "name": "Disable anti ghost ping.",
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
                custom_id: 'channel_select_3',
                placeholder: 'select a channel.',
                max_values: 1,
              }),
            )

          const messageEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Setup Anti Ghost Ping (step 1 of 1)')
            .setDescription('Please select a channel where all the logs will go when a ghost ping occurs.')

          const row2 = new ActionRowBuilder()
            .addComponents(
              new RoleSelectMenuBuilder({
                custom_id: 'select_expired',
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
                  Channel: id,
                  IgnoredUser: "None",
                  IgnoredRole: "None"
                }).save();
              }


              const messageEmbed2 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Ghost Ping (Optional 1 of 2)')
                .setDescription(`Please select a user that is whitelisted from the Anti Ghost Ping system.\n\n**THIS IS OPTIONAL!**`)

              const row3 = new ActionRowBuilder()
                .addComponents(
                  new UserSelectMenuBuilder({
                    custom_id: 'user_ignored_ghost',
                    placeholder: 'None Selected.',
                    max_values: 10,
                  }),
                )

              await i.update({ embeds: [messageEmbed2], components: [row3] }).catch(console.log)
              collector2.stop()
            })
          });
          collector2.on('end', collected => {

            console.log(`Collected`);
          })

          //////////////////////////////////////////////////////////////////////////////////////////

          //////////////////////////////////////////// USER SELECT ///////////////////////////////
          const collector3 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.UserSelect, time: 70000 });
          let bbarray = []
          collector3.on('collect', async i => {
            const ids = i.values

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }

            const messageEmbed3 = new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle('Anti Ghost Ping (Optional 2 of 2)')

            let miniArray = []
            i.values.forEach(async users => {
              console.log(users)
              miniArray.push(`<@${users}>`)
            })
            messageEmbed3.setDescription(`User(s): ${miniArray.join(`,`)}\n\nPlease select a role that is whitelisted from ghost pinging others.\n**THIS IS OPTIONAL**`)

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                miniArray.forEach(ele => {
                  bbarray.push(ele.replace("<@", "").replace(">", ""))
                })
                data.IgnoredUser = ids ? ids : []
                data.Guild = interaction.guild.id
                data.save()
              } else {
                miniArray.forEach(ele => {
                  bbarray.push(ele.replace("<@", "").replace(">", ""))
                })
                new DB({
                  Guild: interaction.guild.id,
                  Channel: "None",
                  IgnoredUser: ids ? ids : [],
                  IgnoredRole: "None"
                }).save();
              }
            })

            const row4 = new ActionRowBuilder()
              .addComponents(
                new RoleSelectMenuBuilder({
                  custom_id: 'role_select_anti_ghost',
                  placeholder: 'select a role.',
                  max_values: 1,
                }),
              )


            i.update({ embeds: [messageEmbed3], components: [row4] })
          });
          collector3.on('end', collected => {

            console.log(`Collected`);
          })
          /////////////////////////////////////////////////////////////////////////////////////////////////

          /////////////////////////////////////////// ROLE SELECT ////////////////////////////////////////
          const collector4 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.RoleSelect, time: 70000 });
          collector4.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }
            const ids1 = i.values
            const role = ids1.toString()

            let myRole = interaction.guild.roles.cache.get(role);

            if (myRole.position > interaction.guild.members.me.roles.highest.position) {
              const errorembed1 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error!')
                .setDescription(`Please make me higher than <@&${role}>.`)
                .setImage('https://images-ext-2.discordapp.net/external/F-nlC4KJFZAtlgMauMMU1nWevowd68xn9F7YC7dGvgg/https/i.ibb.co/9W6hN4g/Discord-NVog-Zd-QDDX.png')
              await i.reply({ embeds: [errorembed1], components: [], ephemeral: true }).catch(console.log)
            } else {

              DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if (data) {
                  data.IgnoredRole = role
                  data.Guild = interaction.guild.id
                  data.save()
                } else {
                  new DB({
                    Guild: interaction.guild.id,
                    Channel: "None",
                    IgnoredUser: "None",
                    IgnoredRole: role
                  }).save();
                }
              })

              const messageEmbed4 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Ghost Ping setup complete.')
                .setDescription(`Ignored role: <@&${role}>\n\n**Thanks for using AntiSystem.**`)

              i.update({ embeds: [messageEmbed4], components: [] })
            }

          })
          ///////////////////////////////////////////////////////////////////////////////////////////////
          break;
        case "disable":
          const errornodata = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Anti Ghost Ping can not be disabled.')
            .setDescription(`Anti Ghost Ping is already disabled!`)

          DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (!data) {
              interaction.reply({ embeds: [errornodata] })
            } else {
              const messageEmbed5 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Are you sure you want to continue?')
                .setDescription(`All of the setup progress will be lost and AntiSystem will no longer log ghost pings.`)

              const row5 = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('continue_anti_ghost')
                    .setLabel('Continue')
                    .setStyle(ButtonStyle.Danger),
                );

              const row_disabled_btn = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('continue_anti_ghost_disabled')
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

              const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 70000 });

              collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                  await DB.deleteOne({ Guild: interaction.guild.id })

                  const messageEmbed6 = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`Anti Ghost Ping has been disabled.`)
                    .setDescription(`Action by <@${i.user.id}>`)

                  i.update({ embeds: [messageEmbed6], components: [] });
                } else {
                  i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                }
              });

              collector.on('end', collected => {
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