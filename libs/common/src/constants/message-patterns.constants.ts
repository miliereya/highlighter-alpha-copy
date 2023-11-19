export const enum USER_MESSAGE_PATTERNS {
	AUTHENTICATE = 'authenticate',
	ADD_HIGHLIGHT = 'add_highlight',
	REMOVE_HIGHLIGHT = 'remove_highlight',
	LIKE_HIGHLIGHT = 'like_highlight',
}

export const enum ADMIN_MESSAGE_PATTERNS {
	AUTHENTICATE = 'authenticate',
}

export const enum HIGHLIGHT_MESSAGE_PATTERNS {
	GET_PREVIEWS = 'get_previews',
}

export const enum CATEGORY_MESSAGE_PATTERNS {
	REMOVE_DELETED_GAME = 'remove_deleted_game',
}

export const enum GAME_MESSAGE_PATTERNS {
	REMOVE_DELETED_CATEGORY = 'remove_deleted_category',
}

export const enum EMAIL_MESSAGE_PATTERNS {
	SEND = 'send',
}
