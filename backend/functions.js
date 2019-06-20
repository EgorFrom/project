function JWTsign(object){
	return {
        id: object.id,
        email: object.email,
        firini: object.firini,
        hrizoliti: object.hrizoliti,
        bukli: object.bukli,
        margini: object.margini,
        vaariti: object.vaariti,
        flagArt: object.flagArt,
        flagBoe: object.flagBoe,
        flagVoe: object.flagVoe,
        flagDet: object.flagDet,
        flagDVS: object.flagDVS,
        flagDD: object.flagDD,
        flagDoc: object.flagDoc,
        flagDra: object.flagDra,
        flagIst: object.flagIst,
        flagCom: object.flagCom,
        flagCri: object.flagCri,
        flagMel: object.flagMel,
        flagMis: object.flagMis,
        flagPri: object.flagPri,
        flagFK: object.flagFK,
        flagTri: object.flagTri,
        flagUja: object.flagUja,
        flagFan: object.flagFan,
        flagFen: object.flagFen,
        flagEro: object.flagEro,
        comment: object.comment,
        nickname: object.nickname,
        EDG: object.EDG
      }
}

module.exports.JWTsign = JWTsign;
