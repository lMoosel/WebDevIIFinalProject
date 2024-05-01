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
    if (!email.includes("@")) return false;
    let s = email.split("@");
    if (s.length != 2) return false;
    let [prefix, domain] = s;
    if (!prefix.length || !domain.length) return false;
  
    for (let i = 0; i < prefix.length; i++) {
        if (
            charIsLowercase(prefix[i])
            ||
            charIsNumber(prefix[i])
        ) {
            continue;
        } else if ("_.-".includes(prefix[i])) {
            if (!i) return false;
            if (i == prefix.length - 1) return false;
            if ("_.-".includes(prefix[i - 1])) return false;
            continue;
        } else {
            return false;
        }
    }
  
    let idx = -1;
    for (let i = domain.length - 1; i >= 0; i--) {
        if (domain[i] == ".") {
            idx = i;
            break;
        }
    }
    if (idx == -1 || idx == 0 || idx == domain.length - 1) return false;
    let tld = domain.substring(idx + 1);
    let site = domain.substring(0, idx - 1);
    for (let i = 0; i < site.length; i++) {
        if (!(
            charIsLowercase(site[i]) || charIsNumber(site[i]) || site[i] == "-"
        )) { return false }
    }
    if (tld.length < 2) return false;
    return true;
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

  
export {charIsLowercase, charIsNumber, validateDate, isValidEmail, validateArgsString, validatePassword, isValidId, verifyTimeRange, verifyOffset, verifyLimit}