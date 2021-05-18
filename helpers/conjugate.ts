import {mailNames} from "../assets/mail";
import {femaleNames} from "../assets/femail";

export const conjugate = (name: string) => {
    const lowerName = name.toLowerCase();
    const mail = mailNames;
    const female = femaleNames;
    const vowels = ['а', 'о', 'у', 'и', 'і', 'є', 'е', 'ї', 'я', 'ю'];
    const hissings = ['щ', 'ж', 'ч'];
    const GGKH = ['г', 'ґ', 'к', 'х'];

    const isLastYa = name.charAt(name.length-1) === 'я';
    const isLastA = name.charAt(name.length-1) === 'а';
    const isLastYe = name.charAt(name.length-1) === 'й';
    const isLastSoftSign = name.charAt(name.length-1) === 'ь';
    const isVowelBeforeLast = vowels.includes(lowerName.charAt(lowerName.length-2));
    const isLastO = name.charAt(name.length-1) === 'о';
    const isLastGGKH = GGKH.includes(lowerName.charAt(lowerName.length-1));
    const isApostropheBeforeLast = lowerName.charAt(lowerName.length-2) === "'"
      || lowerName.charAt(lowerName.length-2) === "`";
    let sex = undefined;

    if (mail.find(name => name.toLowerCase() === lowerName)) {
        sex = 'MAIL';
    }
    if (female.find(name => name.toLowerCase() === lowerName)) {
        sex = 'FEMALE';
    }

    if (sex === 'MAIL' || sex === 'FEMALE') {
        if (lowerName === 'олег') return 'Олеже';

        if (isLastYa && (isVowelBeforeLast || isApostropheBeforeLast)) {
                return name.slice(0, lowerName.length - 2) + 'іє';
        }
        if (isLastYa && (!isVowelBeforeLast || !isApostropheBeforeLast)) {
            return name.slice(0, lowerName.length - 1) + 'е';
        }

        if (sex === 'MAIL' && isLastGGKH) {
            return name.slice(0, lowerName.length - 1) + 'у';
        }
        if (sex === 'MAIL' && (isLastYe || isLastSoftSign) && (!isVowelBeforeLast && !isApostropheBeforeLast)) {
            return name.slice(0, lowerName.length - 1) + 'ю';
        }

        if (sex === 'MAIL' && isLastYe && (isVowelBeforeLast || isApostropheBeforeLast)) {
            return name.slice(0, lowerName.length - 1) + 'є';
        }

        if (sex === 'MAIL' && !isLastYe && !isLastGGKH && !isLastYa && !isLastA) {
            return name + 'e';
        }
        if (sex === 'FEMALE' && isLastA) {
            return name.slice(0, name.length-1) + 'o';
        }
        if (sex === 'MAIL' && isLastO) {
            return name.slice(0, name.length - 1) + 'e';
        }
    } else {
        return name;
    }
}