import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";

let charIsLowercase = function (c) {
    return c >= "a" && c <= "z";
}
let charIsNumber = function (c) {
    return c >= "0" && c <= "9";
}
const validateDate = (date, cmpDate = null) => {
    const formats = ["MM/DD/YYYY", "MM/D/YYYY", "M/DD/YYYY", "M/D/YYYY"];
    if (!moment(date, formats, true).isValid()) {
      throw new GraphQLError(`Invalid date`, {
        extensions: { code: "BAD_REQUEST" },
      });
    }
  
    if (!cmpDate) cmpDate = "01/01/1900";
  
    if (moment(date).isBefore(cmpDate) || moment(date).isAfter("12/31/2024")) {
      throw new GraphQLError(`Invalid date`, {
        extensions: { code: "BAD_REQUEST" },
      });
    }
};
let isValidEmail = function (email) {
    // Based on https://help.xmatters.com/ondemand/trial/valid_email_format.htm
    // if (!email.includes("@")) return false;
    // let s = email.split("@");
    // if (s.length != 2) return false;
    // let [prefix, domain] = s;
    // if (!prefix.length || !domain.length) return false;
  
    // for (let i = 0; i < prefix.length; i++) {
    //     if (
    //         charIsLowercase(prefix[i])
    //         ||
    //         charIsNumber(prefix[i])
    //     ) {
    //         continue;
    //     } else if ("_.-".includes(prefix[i])) {
    //         if (!i) return false;
    //         if (i == prefix.length - 1) return false;
    //         if ("_.-".includes(prefix[i - 1])) return false;
    //         continue;
    //     } else {
    //         return false;
    //     }
    // }
  
    // let idx = -1;
    // for (let i = domain.length - 1; i >= 0; i--) {
    //     if (domain[i] == ".") {
    //         idx = i;
    //         break;
    //     }
    // }
    // if (idx == -1 || idx == 0 || idx == domain.length - 1) return false;
    // let tld = domain.substring(idx + 1);
    // let site = domain.substring(0, idx - 1);
    // for (let i = 0; i < site.length; i++) {
    //     if (!(
    //         charIsLowercase(site[i]) || charIsNumber(site[i]) || site[i] == "-"
    //     )) { return false }
    // }
    // if (tld.length < 2) return false;
    // return true;

    //Regex used from https://emailregex.com/
    let emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/ 
    return emailRegex.test(email)

  }
const validateArgsString = (args) => {
    // Check for empty strings
    for (const key of Object.keys(args)) {
      if (typeof args[key] === "string") {
        // TODO - Updat the arg in args
        args[key] = args[key].trim();
  
        if (args[key].length < 1) {
          throw new GraphQLError(`Empty field`, {
            extensions: { code: "BAD_REQUEST" },
          });
        }
      } else if (Array.isArray(args[key])) {
        for (let item of args[key]) {
          if (typeof item === "string") {
            item = item.trim();
  
            if (item.length < 1) {
              throw new GraphQLError(`Empty field`, {
                extensions: { code: "BAD_REQUEST" },
              });
            }
          }
        }
      }
    }
};
function validatePassword(password) {
    if (password.length < 8) {
      throw new GraphQLError('Password must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      throw new GraphQLError('Password must contain at least one uppercase letter.');
    }
    if (!/[0-9]/.test(password)) {
      throw new GraphQLError('Password must contain at least one number.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new GraphQLError('Password must contain at least one special character.');
    }
}
function isValidId(id) {
    if (!id) throw new GraphQLError('No id given');
    if (typeof id !== 'string') throw new GraphQLError('Id is not a string');
    if (!ObjectId.isValid(id.trim())) throw new GraphQLError('Id is not valid');
}
function verifyTimeRange(time_range) {
    const validRanges = ['short_term', 'medium_term', 'long_term'];
    if (!validRanges.includes(time_range)) {
        throw new Error(`Expected one of ${validRanges.join(', ')}, but got ${time_range}.`);
    }
}
function verifyOffset(offset) {
    if (typeof offset !== 'number' || offset < 0) {
        throw new Error(`The offset must be a non-negative integer.`);
    }
}
function verifyLimit(limit) {
    const maxLimit = 50; 
    if (typeof limit !== 'number' || limit < 1 || limit > maxLimit) {
        throw new Error(`The limit must be a number between 1 and ${maxLimit}.`);
    }
}
function verifyType(types) {
  if (!Array.isArray(types) || types.length === 0 || types.length > 3 || !types.every(type => ["album", "track", "artist"].includes(type))) {
    throw new GraphQLError('Most only be an array of "album", "track", "artist".');
  } 
}

function calculateAverages(audioFeatures) {
  let sums = {
      danceability: 0,
      energy: 0,
      key: 0,
      loudness: 0,
      mode: 0,
      speechiness: 0,
      acousticness: 0,
      instrumentalness: 0,
      liveness: 0,
      valence: 0,
      tempo: 0,
      duration_ms: 0,
      time_signature: 0
  };
  let count = audioFeatures.length;

  audioFeatures.forEach(track => {
      sums.danceability += track.danceability;
      sums.energy += track.energy;
      sums.key += track.key;
      sums.loudness += track.loudness;
      sums.mode += track.mode;
      sums.speechiness += track.speechiness;
      sums.acousticness += track.acousticness;
      sums.instrumentalness += track.instrumentalness;
      sums.liveness += track.liveness;
      sums.valence += track.valence;
      sums.tempo += track.tempo;
      sums.duration_ms += track.duration_ms;
      sums.time_signature += track.time_signature;
  });
  let averages = {};
  for (let prop in sums) {
      averages[prop] = sums[prop] / count;
  }
  return averages;
}

export {calculateAverages, verifyType, charIsLowercase, charIsNumber, validateDate, isValidEmail, validateArgsString, validatePassword, isValidId, verifyTimeRange, verifyOffset, verifyLimit}