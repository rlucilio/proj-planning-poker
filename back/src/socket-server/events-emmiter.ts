export enum EventsEmmiterSocket {
    joinRoom = 'join_room',
    returnRoom = 'return_room',
    timeoutFlipCards = 'timeout_flip_cards',
    newTask = 'new_task',
    newObserver = 'new_observer',
    newVote = 'new_vote',
    voteAfterReveal = 'vote_after_reveal',
    allUserVote = 'all_user_votes',
    flipVotesResult = 'flip_votes_result',
    userDisconnected = 'user_disconnected',
    error = 'error_in_room',
    resetTask = 'reset_task'
}
