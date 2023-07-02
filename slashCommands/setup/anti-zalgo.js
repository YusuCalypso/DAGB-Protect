const { ApplicationCommandType, EmbedBuilder, RoleSelectMenuBuilder, ActionRowBuilder, ComponentType, ChannelSelectMenuBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
var DB = require('../../Models/anti-zalgo.js')


module.exports = {
  name: 'anti-zalgo',
  description: "Setup or disable anti zalgo.",
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
          name: "Setup/Configure anti zalgo.",
          value: "st_con"
        },
        {
          "name": "Disable anti zalgo.",
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
                custom_id: 'channel_select_2',
                placeholder: 'select a channel.',
                max_values: 1,
              }),
            )

          const messageEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Setup Anti zalgo (step 1 of 2)')
            .setDescription('Please select a channel where all the logs will go.')

          const row2 = new ActionRowBuilder()
            .addComponents(
              new RoleSelectMenuBuilder({
                custom_id: 'select_expired_2',
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
                  Action: "None",
                  Time: "NaN",
                  IgnoredUser: "None",
                  IgnoredRole: "None"
                }).save();
              }


              const messageEmbed2 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Zalgo (step 2 of 2)')
                .setDescription(`Please select the action that will happen.\n**Delete Message** - Just delete the message with the zalgo and log it.\n**Delete Message and timeout** - Delete the message with the zalgo text and time the user out.`)

              const row3 = new ActionRowBuilder()
                .addComponents(
                  new StringSelectMenuBuilder()
                    .setCustomId('anti_zalgo_1')
                    .setPlaceholder('Nothing selected')
                    .addOptions(
                      {
                        label: 'Delete Message',
                        description: 'Just delete the message and take no further action.',
                        value: 'dl_message',
                      },
                      {
                        label: 'Delete message and timeout user',
                        description: 'Take further action by timing out the user.',
                        value: 'dl_message_and_timeout',
                      },
                    ),
                );

              await i.update({ embeds: [messageEmbed2], components: [row3] }).catch(console.log)
              collector2.stop()
            })
          });
          collector2.on('end', collected => {

            console.log(`Collected`);
          })

          //////////////////////////////////////////////////////////////////////////////////////////

          //////////////////////////////////////////// OPTION SELECT ///////////////////////////////
          const collector3 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 70000 });

          collector3.on('collect', async i => {

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }

            const choice = i.values
            const selection = choice.toString()

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.Action = selection
                data.Time = "60000"
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                  Channel: "None",
                  Action: selection,
                  Time: "60000",
                  IgnoredUser: "None",
                  IgnoredRole: "None"
                }).save();
              }


              if (i.values[0] === "dl_message_and_timeout") {
                const messageEmbed6 = new EmbedBuilder()
                  .setColor(0xFF0000)
                  .setTitle(`Please select how long to time out the user for.`)
                  .setDescription(`**The user will be timed out for the length you select!**\n\n**If nothing is selected the time will be auto set to 1MIN!**`)

                const row7 = new ActionRowBuilder()
                  .addComponents(
                    new StringSelectMenuBuilder()
                      .setCustomId('anti_zalgo_setup')
                      .setPlaceholder('Nothing selected')
                      .addOptions(
                        {
                          label: '60 secs',
                          description: '60 second timeout.',
                          value: '60000',
                        },
                        {
                          label: '5 mins',
                          description: '5 minute timeout.',
                          value: '300000',
                        },
                        {
                          label: '10 mins',
                          description: '10 minute timeout.',
                          value: '600000',
                        },
                        {
                          label: '1 hour',
                          description: '1 hour timeout.',
                          value: '3600000',
                        },
                        {
                          label: '1 day',
                          description: '1 day timeout.',
                          value: '86400000',
                        },
                      ),
                  );

                i.update({ embeds: [messageEmbed6], components: [row7] }).catch(console.log)
                collector3.stop()
              }
              if (i.values[0] === "dl_message") {

                DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.Action = i.values[0]
                data.Time = "NaN"
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                  Channel: "None",
                  Action: i.values[0],
                  Time: "NaN",
                  IgnoredUser: "None",
                  IgnoredRole: "None"
                }).save();
              }
                  
            const messageEmbed3 = new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle(`Setup complete!`)
              .setDescription(`OPTIONAL: please select a whitelisted user.\nIf a user is selected **they will be able to send zalgo text**.`)

            const row7 = new ActionRowBuilder()
              .addComponents(
                new UserSelectMenuBuilder({
                  custom_id: 'user_select_setup_ant_zalgo_1',
                  placeholder: 'select user(s).',
                  max_values: 10,
                }),
              )
                
                await i.update({ embeds: [messageEmbed3], components: [row7] }).catch(console.log)
                collector2.stop()
                })
              }
            })
          });
          collector3.on('end', collected => {

            console.log(`Collected - (collector3)`);
          })
          ///////////////////////////////////////////////////////////////////////////////////////////////
          //////////////////////////////////////////// OPTION SELECT 2 ///////////////////////////////
          const collector4 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 20000 });

          collector4.on('collect', async i => {

            const messageEmbed7 = new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle(`Setup complete! OPTIONAL: please select a whitelisted user.`)

            const row7 = new ActionRowBuilder()
              .addComponents(
                new UserSelectMenuBuilder({
                  custom_id: 'user_select_setup_ant_zalgo',
                  placeholder: 'select user(s).',
                  max_values: 10,
                }),
              )

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }
            /////////////////////////// 1  MIN ///////////
            if (i.values[0] === "60000") {
              DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if (data) {
                  data.Time = i.values[0]
                  data.Guild = interaction.guild.id
                  data.save()
                } else {
                  new DB({
                    Guild: interaction.guild.id,
                    Channel: "None",
                    Action: "None",
                    Time: i.values[0],
                    IgnoredUser: "None",
                    IgnoredRole: "None"
                  }).save();
                }

                messageEmbed7.setDescription("**The user will be able to send zalgo text!**")
                messageEmbed7.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Log Channel: ', value: `<#${data.Channel}>`, inline: true },
		{ name: 'Action: ', value: 'Delete message and timeout user.', inline: true },
    { name: 'Timeout lengh: ', value: '1 min.', inline: true },
	)
                await i.update({ embeds: [messageEmbed7], components: [row7] }).catch(console.log)
              })

              collector4.stop()
            }
            /////////////////////////// 5  MIN ///////////
            if (i.values[0] === "300000") {
              DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if (data) {
                  data.Time = i.values[0]
                  data.Guild = interaction.guild.id
                  data.save()
                } else {
                  new DB({
                    Guild: interaction.guild.id,
                    Channel: "None",
                    Action: "None",
                    Time: i.values[0],
                    IgnoredUser: "None",
                    IgnoredRole: "None"
                  }).save();
                }

                messageEmbed7.setDescription("**The user will be able to send zalgo text!**")
                messageEmbed7.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Log Channel: ', value: `<#${data.Channel}>`, inline: true },
		{ name: 'Action: ', value: 'Delete message and timeout user.', inline: true },
    { name: 'Timeout lengh: ', value: '5 min.', inline: true },
)
                await i.update({ embeds: [messageEmbed7], components: [row7] }).catch(console.log)
              })

              collector4.stop()
            }

            /////////////////////////// 10  MIN ///////////
            if (i.values[0] === "600000") {
              DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if (data) {
                  data.Time = i.values[0]
                  data.Guild = interaction.guild.id
                  data.save()
                } else {
                  new DB({
                    Guild: interaction.guild.id,
                    Channel: "None",
                    Action: "None",
                    Time: i.values[0],
                    IgnoredUser: "None",
                    IgnoredRole: "None"
                  }).save();
                }

                messageEmbed7.setDescription("**The user will be able to send zalgo text!**")
                messageEmbed7.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Log Channel: ', value: `<#${data.Channel}>`, inline: true },
		{ name: 'Action: ', value: 'Delete message and timeout user.', inline: true },
    { name: 'Timeout lengh: ', value: '10 min.', inline: true },
                  )
                await i.update({ embeds: [messageEmbed7], components: [row7] }).catch(console.log)
              })

              collector4.stop()
            }

            /////////////////////////// 1  Hour ///////////
            if (i.values[0] === "3600000") {
              DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if (data) {
                  data.Time = i.values[0]
                  data.Guild = interaction.guild.id
                  data.save()
                } else {
                  new DB({
                    Guild: interaction.guild.id,
                    Channel: "None",
                    Action: "None",
                    Time: i.values[0],
                    IgnoredUser: "None",
                    IgnoredRole: "None"
                  }).save();
                }

                messageEmbed7.setDescription("**The user will be able to send zalgo text!**")
                messageEmbed7.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Log Channel: ', value: `<#${data.Channel}>`, inline: true },
		{ name: 'Action: ', value: 'Delete message and timeout user.', inline: true },
    { name: 'Timeout lengh: ', value: '1 hour.', inline: true },
                  )
                await i.update({ embeds: [messageEmbed7], components: [row7] }).catch(console.log)
              })

              collector4.stop()
            }
            /////////////////////////// 1  Day ///////////
            if (i.values[0] === "86400000") {
              DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if (data) {
                  console.log(data)
                  data.Time = i.values[0]
                  data.Guild = interaction.guild.id
                  console.log(data)
                  data.save()
                } else {
                  new DB({
                    Guild: interaction.guild.id,
                    Channel: "None",
                    Action: "None",
                    Time: i.values[0],
                    IgnoredUser: "None",
                    IgnoredRole: "None"
                  }).save();
                }

                messageEmbed7.setDescription("**The user will be able to send zalgo text!**")
                messageEmbed7.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Log Channel: ', value: `<#${data.Channel}>`, inline: true },
		{ name: 'Action: ', value: 'Delete message and timeout user.', inline: true },
    { name: 'Timeout lengh: ', value: '1 day.', inline: true },
)
                await i.update({ embeds: [messageEmbed7], components: [row7] }).catch(console.log)
              })

              collector4.stop()
            }
          })
          collector4.on('end', colleted => {
            console.log(`Collected`);
          })
          ///////////////////////////////////////////////////////////////////////////////////////////////

          //////////////////////////////////////////// USER SELECT ///////////////////////////////
          const collector5 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.UserSelect, time: 70000 });
          let bbarray = []
          collector5.on('collect', async i => {
            const ids = i.values

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }

            const messageEmbed12 = new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle('Anti Zalgo (Optional 2 of 2)')

            let miniArray = []
            i.values.forEach(async users => {
              console.log(users)
              miniArray.push(`<@${users}>`)
            })
            messageEmbed12.setDescription(`User(s): ${miniArray.join(`,`)}\n\nPlease select a role that is whitelisted from sending zalgo text.\n**THIS IS OPTIONAL**`)

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
                    Action: "None",
                    Time: "NaN",
                    IgnoredUser: ids ? ids : [],
                    IgnoredRole: "None"
                }).save();
              }

              messageEmbed12.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Log Channel: ', value: `<#${data.Channel}>`, inline: true },
    {name: 'Ignored Users: ', value: `${miniArray.join(`,`)}`}
                  )

              const row11 = new ActionRowBuilder()
              .addComponents(
                new RoleSelectMenuBuilder({
                  custom_id: 'role_select_anti_zalgo',
                  placeholder: 'select a role.',
                  max_values: 1,
                }),
              )


            i.update({ embeds: [messageEmbed12], components: [row11] }).catch(console.log)
            })
          });
          collector5.on('end', collected => {

            console.log(`Collected`);
          })
          /////////////////////////////////////////////////////////////////////////////////////////////////

          //////////////////////////////////////////// USER SELECT ///////////////////////////////
          const collector6 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.RoleSelect, time: 70000 });
          collector6.on('collect', async i => {
            const idrole = i.values[0]

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }
            let myRole = interaction.guild.roles.cache.get(idrole);

            if (myRole.position > interaction.guild.members.me.roles.highest.position) {
              const errorembed1 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error!')
                .setDescription(`Please make me higher than <@&${idrole}>.`)
                .setImage('https://images-ext-2.discordapp.net/external/F-nlC4KJFZAtlgMauMMU1nWevowd68xn9F7YC7dGvgg/https/i.ibb.co/9W6hN4g/Discord-NVog-Zd-QDDX.png')
              await i.reply({ embeds: [errorembed1], components: [], ephemeral: true }).catch(console.log)
            } else {

            const messageEmbed14 = new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle('Anti Zalgo all options complete!')

      
            messageEmbed14.setDescription(`Setup has been completed!`)

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.IgnoredRole = idrole ? idrole : "None"
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                    Channel: "None",
                    Action: "None",
                    Time: "NaN",
                    IgnoredUser: "None",
                    IgnoredRole: idrole ? idrole : "None"
                }).save();
              }

              messageEmbed14.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Log Channel: ', value: `<#${data.Channel}>`, inline: true },
    {name: 'Ignored Role: ', value: `<@&${idrole}>`}
                  )
            })

            i.update({ embeds: [messageEmbed14], components: [] })
            }
          });
          collector6.on('end', collected => {

            console.log(`Collected`);
          })
          /////////////////////////////////////////////////////////////////////////////////////////////////
          
          break;
        case "disable":

          const errornodata = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Anti Zalgo can not be disabled.')
            .setDescription(`Anti Zalgo is already disabled!`)

          DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (!data) {
              interaction.reply({ embeds: [errornodata] })
            } else {
              const messageEmbed5 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Are you sure you want to continue?')
                .setDescription(`All of the setup progress will be lost and AntiSystem will no longer delete messages deemed zalgo text.`)

              const row5 = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('continue_anti_zalgo')
                    .setLabel('Continue')
                    .setStyle(ButtonStyle.Danger),
                );

              const row_disabled_btn = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('continue_anti_zalgo_disabled')
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
                    .setTitle(`Anti Zalgo has been disabled.`)
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