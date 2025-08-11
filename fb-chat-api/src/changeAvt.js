"use strict";

const utils = require("../utils");
const log = require("npmlog");
const axios = require("axios");

async function postImage(api, BotID, form) {
  const Data = await api.httpPostFormData(
    `https://www.facebook.com/profile/picture/upload/?profile_id=${BotID}&photo_source=57&av=${BotID}`,
    form
  );
  return JSON.parse(Data.split("for (;;);")[1]);
}

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Change avatar function
   * @param {string} link - Image URL or path
   * @param {string} caption - Caption text
   * @param {function} callback - Callback function(err, success)
   * @returns {Promise}
   */
  return function changeAvt(link, caption, callback) {
    let resolveFunc = () => {};
    let rejectFunc = () => {};
    const returnPromise = new Promise((resolve, reject) => {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, data) {
        if (err) return rejectFunc(err);
        resolveFunc(data);
      };
    }

    try {
      axios
        .get(link, { responseType: "stream" })
        .then((data) => {
          postImage(api, ctx.userID, { file: data.data })
            .then((data) => {
              if (data.error)
                throw new Error(
                  JSON.stringify({
                    error: data.error,
                    des: data.error.errorDescription,
                  })
                );

              const form = {
                av: ctx.userID,
                fb_api_req_friendly_name:
                  "ProfileCometProfilePictureSetMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "5066134240065849",
                variables: JSON.stringify({
                  input: {
                    caption: caption || "",
                    existing_photo_id: data.payload.fbid,
                    expiration_time: null,
                    profile_id: ctx.userID,
                    profile_pic_method: "EXISTING",
                    profile_pic_source: "TIMELINE",
                    scaled_crop_rect: {
                      height: 1,
                      width: 1,
                      x: 0,
                      y: 0,
                    },
                    skip_cropping: true,
                    actor_id: ctx.userID,
                    client_mutation_id: Math.round(Math.random() * 19).toString(),
                  },
                  isPage: false,
                  isProfile: true,
                  scale: 3,
                }),
              };

              defaultFuncs
                .post("https://www.facebook.com/api/graphql/", ctx.jar, form)
                .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
                .then((resData) => {
                  if (resData.error) throw resData;
                  else return callback(null, true);
                })
                .catch((err) => {
                  return callback(err);
                });
            });
        })
        .catch((err) => {
          return callback(err);
        });
    } catch (e) {
      throw e;
    }

    return returnPromise;
  };
};
