import { trigger, transition, style, animate, state, keyframes } from '@angular/animations';

export const flipRouter =
    trigger('flipRouter', [
        transition('* => *', animate('1.1s', keyframes([
            style({ opacity: '0', transform: 'translateY(500px)', 'animation-timing-function': 'ease-in' }),
            style({ opacity: '1', transform: 'translateY(0)', 'animation-timing-function': 'ease-out' }),
            style({ transform: 'translateY(65px)', 'animation-timing-function': 'ease-in' }),
            style({ transform: 'translateY(0)', 'animation-timing-function': 'ease-out' }),
            style({ transform: 'translateY(28px)', 'animation-timing-function': 'ease-in' }),
            style({ transform: 'translateY(0)', 'animation-timing-function': 'ease-out' }),
            style({ transform: 'translateY(8px)', 'animation-timing-function': 'ease-in' }),
            style({ transform: 'translateY(0)', 'animation-timing-function': 'ease-out' })
        ])))
    ]);
