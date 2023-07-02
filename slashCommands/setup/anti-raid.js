const { ApplicationCommandType, EmbedBuilder, RoleSelectMenuBuilder, ActionRowBuilder, ComponentType, ChannelSelectMenuBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, StringSelectMenuBuilder, WebhookClient, PermissionsBitField, ChannelType } = require('discord.js');
var DB = require('../../Models/anti-raid.js')
var DB2 = require('../../Models/webhooks.js')

module.exports = {
  name: 'anti-raid',
  description: "Setup or disable anti raid.",
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
          name: "Setup/Configure anti raid.",
          value: "st_con"
        },
        {
          "name": "Disable anti raid.",
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
            const member = await interaction.guild.members.fetch(interaction.user.id)
       if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks) 
           || 
           !member.permissions.has(PermissionsBitField.Flags.ManageGuild)){
         const messageEmbed434 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Please make sure I have Manage Webhooks Permissions and you have Manage Guild!')
                .setDescription('Please make sure that I the correct permissions to manage webhooks.\n\n**I need Manage Webhook permisions to make a Log webhook.**')
         await interaction.reply({ embeds: [messageEmbed434], components: [] }).catch(console.log)
         } else {
         
          const row = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('anti_raid_setup')
                .setPlaceholder('Nothing selected')
                .setMinValues(1)
                .setMaxValues(4)
                .addOptions(
                  {
                    label: 'Member Ban',
                    description: 'Check if a user is banned by another user.',
                    value: 'member_ban_on',
                  },
                  {
                    label: 'Member Kick',
                    description: 'Check if a user is kicked by another user.',
                    value: 'member_kick',
                  },
                  {
                    label: 'Member Nickname Update',
                    description: 'Check if a users nickname is updated.',
                    value: 'member_nickname_update',
                  },
                  {
                    label: 'Member Role Update',
                    description: 'Check if a user has a role added or removed.',
                    value: 'member_role_update',
                  },
                ),
            );



          const messageEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Anti Raid Setup (step 1 of 5)')
            .setDescription(`Please select what to check for: (User Events)\n\n**Member Ban: If a member gets banned from the server.**\n**Member Kick: If a member gets kicked from the server.**\n**Member Nickname Update: If a members nickname gets changed.**\n**Member Role Update: If a member has a role added or removed by another member.**\n\n**FOR BETTER CONFIGURATION PLEASE GO TO:** https://antisystem.xyz/dashboard/${interaction.guild.id}/wizards/antiraid/`)

          const notfinished = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Anti Raid Setup failed!')
            .setDescription(`Please Make sure to do all the steps.\n\nFor better customization please go to https://antisystem.xyz/dashboard/${interaction.guild.id}/wizards/antiraid`)
          
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
              DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data.Channel === "NaN") {
                interaction.editReply({
                  embeds: [notfinished],
                  components: []
                }).catch(console.log)
              } else {
                interaction.editReply({
                components: [row2]
              }).catch(console.log)
              }
              })
            }, "60000")
          })
       }


          //////////////////////////////////////// User Events Select ////////////////////////////////////////////////
          const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 70000 });

          collector.on('collect', async i => {

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }

            if (i.customId !== "anti_raid_setup") return;

            const choice = i.values
            var memberban = "Off"
            var memberkick = "Off"
            var membernicknameupdate = "Off"
            var memberroleupdate = "Off"

            if (choice.includes('member_ban_on')) {
              memberban = "on"
            }

            if (choice.includes('member_kick')) {
              memberkick = "on"
            }

            if (choice.includes('member_nickname_update')) {
              membernicknameupdate = "on"
            }

            if (choice.includes('member_role_update')) {
              memberroleupdate = "on"
            }

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.MemberBan = memberban
                data.MemberKick = memberkick
                data.MemberNickNameUpdate = membernicknameupdate
                data.MemberRoleUpdate = memberroleupdate
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                  Channel: "NaN",
                  MemberBan: memberban,
                  MemberKick: memberkick,
                  MemberNickNameUpdate: membernicknameupdate,
                  MemberRoleUpdate: memberroleupdate,
                  RoleCreate: "Off",
                  RoleDelete: "Off",
                  ChannelCreate: "Off",
                  ChannelDelete: "Off",
                  NewAccounts: "Off",
                  KickNewAccounts: "Off",
                  BanNewAccounts: "Off"
                }).save();
              }

              const messageEmbed2 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Raid Setup (step 2 of 5)')
                .setDescription('Please select what to check for: (Role  Events)\n\n**Role Create: If a role is created.**\n**Role Delete: If a role is deleted.**')

              const row2 = new ActionRowBuilder()
                .addComponents(
                  new StringSelectMenuBuilder()
                    .setCustomId('anti_raid_setup_1')
                    .setPlaceholder('Nothing selected')
                    .setMinValues(1)
                    .setMaxValues(2)
                    .addOptions(
                      {
                        label: 'Role Create',
                        description: 'Check if a user creates a role and then take action.',
                        value: 'role_create',
                      },
                      {
                        label: 'Role Delete',
                        description: 'Check if a user deletes a role and then take action.',
                        value: 'role_delete',
                      },
                    ),
                );

              await i.update({ embeds: [messageEmbed2], components: [row2] }).catch(console.log)
              collector.stop()
            })

          })
          collector.on('end', collected => {

            console.log(`Collected`);
          })

          //////////////////////////////////////////////////////////////////////////////////////////

          //////////////////////////////////////// Role Events Select ////////////////////////////////////////////////
          const collector2 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 70000 });

          collector2.on('collect', async i => {

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }

            if (i.customId !== "anti_raid_setup_1") return;

            const choice1 = i.values
            var rolecreate = "Off"
            var roledelete = "Off"

            if (choice1.includes('role_create')) {
              rolecreate = "on"
            }

            if (choice1.includes('role_delete')) {
              roledelete = "on"
            }

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.RoleCreate = rolecreate
                data.RoleDelete = roledelete
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                  Channel: "NaN",
                  MemberBan: "Off",
                  MemberKick: "Off",
                  MemberNickNameUpdate: "Off",
                  MemberRoleUpdate: "Off",
                  RoleCreate: rolecreate,
                  RoleDelete: roledelete,
                  ChannelCreate: "Off",
                  ChannelDelete: "Off",
                  NewAccounts: "Off",
                  KickNewAccounts: "Off",
                  BanNewAccounts: "Off"
                }).save();
              }

              const messageEmbed3 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Raid Setup (step 3 of 5)')
                .setDescription('Please select what to check for: (Channel Events)\n\n**Channel Create: If a channel is created.**\n**Channel Delete: If a channel is deleted.**')

              const row3 = new ActionRowBuilder()
                .addComponents(
                  new StringSelectMenuBuilder()
                    .setCustomId('anti_raid_setup_2')
                    .setPlaceholder('Nothing selected')
                    .setMinValues(1)
                    .setMaxValues(2)
                    .addOptions(
                      {
                        label: 'Channel Create',
                        description: 'Check if a user creates a channel and then take action.',
                        value: 'channel_create',
                      },
                      {
                        label: 'Channel Delete',
                        description: 'Check if a user deletes a channel and then take action.',
                        value: 'channel_delete',
                      },
                    ),
                );

              await i.update({ embeds: [messageEmbed3], components: [row3] }).catch(console.log)
              collector2.stop()
            })

          })
          collector2.on('end', collected => {

            console.log(`Collected`);
          })
          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////////////////////////////////////// Channel Events Select ////////////////////////////////////////////////
          const collector3 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 70000 });

          collector3.on('collect', async i => {

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }

            if (i.customId !== "anti_raid_setup_2") return;

            const choice2 = i.values
            var channelcreate = "Off"
            var channeldelete = "Off"

            if (choice2.includes('channel_create')) {
              channelcreate = "on"
            }

            if (choice2.includes('channel_delete')) {
              channeldelete = "on"
            }

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.ChannelCreate = channelcreate
                data.ChannelDelete = channeldelete
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                  Channel: "NaN",
                  MemberBan: "Off",
                  MemberKick: "Off",
                  MemberNickNameUpdate: "Off",
                  MemberRoleUpdate: "Off",
                  RoleCreate: "Off",
                  RoleDelete: "Off",
                  ChannelCreate: channelcreate,
                  ChannelDelete: channeldelete,
                  NewAccounts: "Off",
                  KickNewAccounts: "Off",
                  BanNewAccounts: "Off"
                }).save();
              }

              const messageEmbed4 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Raid Setup (step 4 of 5)')
                .setDescription('Please select what to check for: (User Join Events)\n\n** New account(s): If new accounts join you will be notified.**\n**Kick new accounts: If a account under 7 days or 7 days old join they will be kicked.**\n**Ban new accounts: If a account under 7 days or 7 days old join they will be banned.**')

              const row4 = new ActionRowBuilder()
                .addComponents(
                  new StringSelectMenuBuilder()
                    .setCustomId('anti_raid_setup_3')
                    .setPlaceholder('Nothing selected')
                    .setMinValues(1)
                    .setMaxValues(2)
                    .addOptions(
                      {
                        label: 'Kick New Accounts',
                        description: 'If a account under 7 days or 7 days old join they will be kicked.',
                        value: 'kick_new_accounts',
                      },
                      {
                        label: 'Ban New Accounts',
                        description: 'If a account under 7 days or 7 days old join they will be banned.',
                        value: 'ban_new_accounts',
                      },
                    ),
                );

              await i.update({ embeds: [messageEmbed4], components: [row4] }).catch(console.log)
              collector3.stop()
            })

          })
          collector3.on('end', collected => {

            console.log(`Collected`);
          })
          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////////////////////////////////////// New Account Events Select ////////////////////////////////////////////////
          const collector35 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 70000 });

          collector35.on('collect', async i => {

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }

            if (i.customId !== "anti_raid_setup_3") return;

            const choice2 = i.values
            var kicknewaccounts = "Off"
            var bannewaccounts = "Off"
            var NewAccounts = "Off"

            if (choice2.includes('kick_new_accounts')) {
              kicknewaccounts = "on"
              NewAccounts = "on"
            }

            if (choice2.includes('ban_new_accounts')) {
              bannewaccounts = "on"
              NewAccounts = "on"
            }

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.NewAccounts = NewAccounts
                data.KickNewAccounts = kicknewaccounts
                data.BanNewAccounts = bannewaccounts
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                  Channel: "NaN",
                  MemberBan: "Off",
                  MemberKick: "Off",
                  MemberNickNameUpdate: "Off",
                  MemberRoleUpdate: "Off",
                  RoleCreate: "Off",
                  RoleDelete: "Off",
                  ChannelCreate: "Off",
                  ChannelDelete: "Off",
                  NewAccounts: NewAccounts,
                  KickNewAccounts: kicknewaccounts,
                  BanNewAccounts: bannewaccounts
                }).save();
              }

              const messageEmbed44 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Raid Setup (step 5 of 5)')
                .setDescription('Please select a log channel to log if any action that you set to check for is performed.')

              const row44 = new ActionRowBuilder()
                .addComponents(
                  new ChannelSelectMenuBuilder({
                    custom_id: 'channel_select_setup_anti_raid',
                    placeholder: 'select a channel.',
                    max_values: 1,
                  }),
                )

              await i.update({ embeds: [messageEmbed44], components: [row44] }).catch(console.log)
              collector35.stop()
            })

          })
          collector35.on('end', collected => {

            console.log(`Collected`);
          })
          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //////////////////////////////////////// CHANNEL SELECT ////////////////////////////////////////////////
          const collector254 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.ChannelSelect, time: 70000 });

          collector254.on('collect', async i => {

            if (i.user.id !== interaction.user.id) {
              return i.reply({ content: "This select menu is not for you!", ephemeral: true }).catch(console.log)
            }
            const id = i.channels.first().id
             const member = await interaction.guild.members.fetch(interaction.user.id)
       if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks) 
           || 
           !member.permissions.has(PermissionsBitField.Flags.ManageGuild)){
         const messageEmbed434 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Raid Setup failed!')
                .setDescription('Please make sure that I the correct permissions to manage webhooks.\n\n**I need Manage Webhook permisions to make a Log webhook.**')
         await i.update({ embeds: [messageEmbed434], components: [] }).catch(console.log)
         collector254.stop()
       } else {

         if(i.channels.first().type !== ChannelType.GuildText)  {
           const messageEmbed4344 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Raid Setup failed!')
                .setDescription('Please make sure to select a **text channel** and **NOT** a **Category or Forum!**')
         await i.update({ embeds: [messageEmbed4344], components: [] }).catch(console.log)
         } else {

            DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
              if (data) {
                data.Channel = id
                data.Guild = interaction.guild.id
                data.save()
              } else {
                new DB({
                  Guild: interaction.guild.id,
                  Channel: id,
                  MemberBan: "Off",
                  MemberKick: "Off",
                  MemberNickNameUpdate: "Off",
                  MemberRoleUpdate: "Off",
                  RoleCreate: "Off",
                  RoleDelete: "Off",
                  ChannelCreate: "Off",
                  ChannelDelete: "Off",
                  NewAccounts: "Off",
                  KickNewAccounts: "Off",
                  BanNewAccounts: "Off",
                  WebhookID: "Null",
                  WebhookToken: "Null"
                }).save();
              }

              const messageEmbed2344 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Anti Raid Setup Complete!')
                .setDescription(`Thank you for setting up Anti Raid.\n\n**Configuaration Details**\nLog channel: <#${id}>\nCheck for Member ban: ${data.MemberBan}\nCheck for Member kick: ${data.MemberKick}\nCheck for Member nickname update: ${data.MemberNickNameUpdate}\nCheck for Member role update: ${data.MemberRoleUpdate}\nCheck for Role create: ${data.RoleCreate}\nCheck for Role delete: ${data.RoleDelete}\nCheck for Channel create: ${data.ChannelCreate}\nCheck for Channel delete: ${data.ChannelDelete}\nCheck for New account: ${data.NewAccounts}\nKick new accounts: ${data.KickNewAccounts}\nBan new accounts: ${data.BanNewAccounts}\n\n**End of configuration**`)

              await i.update({ embeds: [messageEmbed2344], components: [] }).catch(console.log)
            })

            const data2 = await DB2.findOne({ Guild: interaction.guild.id })


              if(!data2) {
                i.channels.first().createWebhook({
                  name: 'AntiSystem Logs',
                  avatar: 'https://i.ibb.co/B2HsXRq/logo.webp',
                })
                  .then(webhook => {
                     new DB2({
                       Guild: interaction.guild.id,
                       WebhookID: webhook.id,
                       WebhookToken: webhook.token
                     }).save()
                  })
                  .catch(console.error);
              } else {
                  client.fetchWebhook(data2.WebhookID, data2.WebhookToken )
                   .then(function (webhook) {
                     webhook.edit({
	                  name: 'AntiSystem Logs',
	                  avatar: 'https://i.ibb.co/B2HsXRq/logo.webp',
                  	channel: id,
})
	.then(webhook => console.log(`Edited webhook ${webhook}`))
	.catch(console.error);
                   })
                 .catch(function (error) {
                   i.channels.first().createWebhook({
                  name: 'AntiSystem Logs',
                  avatar: 'https://i.ibb.co/B2HsXRq/logo.webp',
                })
                  .then(webhook => {
                    data2.Guild = interaction.guild.id
                    data2.WebhookID = webhook.id
                    data2.WebhookToken  = webhook.token
                    data2.save()
                  })
                  .catch(console.error);
                 });
                }
           collector254.stop()


         }
            }
          
          });
          collector254.on('end', collected => {

            console.log(`Collected`);
          })

          //////////////////////////////////////////////////////////////////////////////////////////
          break;
        case "disable":
             const errornodata = new EmbedBuilder() 
                .setColor(0xFF0000)
                .setTitle('Anti Raid can not be disabled.')
                .setDescription(`Anti Toxicity is already disabled!`)
    
              DB.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if (!data) {
                  interaction.reply({ embeds: [errornodata] })
                } else {
                  const messag54eEmbed5 = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Are you sure you want to continue?')
                    .setDescription(`All of the setup progress will be lost and AntiSystem will no longer listen for raids.`)
    
                  const ro5w5 = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setCustomId('continue_anti_raid')
                        .setLabel('Continue')
                        .setStyle(ButtonStyle.Danger),
                    );
    
                  const row_disabled_btn = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setCustomId('continue_anti_raid_disabled')
                        .setLabel('Continue')
                        .setDisabled()
                        .setStyle(ButtonStyle.Danger),
                    );
    
                  interaction.reply({ embeds: [messag54eEmbed5], components: [ro5w5] }).then(time => {
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
    
                      const messageEmbed665 = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle(`Anti Raid has been disabled.`)
                        .setDescription(`Action by <@${i.user.id}>`)
    
                      i.update({ embeds: [messageEmbed665], components: [] });
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