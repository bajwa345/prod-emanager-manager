/* eslint-disable */
import * as moment from 'moment';

export const project = {
    reachabilityStats      : {
        overview: {
            'this-week': {
                'new-issues'   : 214,
                'closed-issues': 75,
                'fixed'        : 3,
                'wont-fix'     : 4,
                're-opened'    : 8,
                'needs-triage' : 6
            },
            'last-week': {
                'new-issues'   : 197,
                'closed-issues': 72,
                'fixed'        : 6,
                'wont-fix'     : 11,
                're-opened'    : 6,
                'needs-triage' : 5
            }
        },
        labels  : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series  : {
            'this-week': [
                {
                    name: 'New issues',
                    type: 'line',
                    data: [42, 28, 43, 34, 20, 25, 22]
                },
                {
                    name: 'Closed issues',
                    type: 'column',
                    data: [11, 10, 8, 11, 8, 10, 17]
                }
            ],
            'last-week': [
                {
                    name: 'New issues',
                    type: 'line',
                    data: [37, 32, 39, 27, 18, 24, 20]
                },
                {
                    name: 'Closed issues',
                    type: 'column',
                    data: [9, 8, 10, 12, 7, 11, 15]
                }
            ]
        }
    },
    complainDetails     : {
        columns: ['time', 'type', 'area', 'complainent', 'mobile', 'status', 'actions'],
        rows   : [
            {
                id          : 1,
                type        : 'اسلحے کی کھلے عام نمائش',
                details     : '',
                area        : 'UC-115',
                complainent : 'Usman Mehmod',
                mobile      : '0300-5599660',
                time        : '2022-03-21 04:22 PM',
                status      : 'unresolved'
            },
            {
                id          : 2,
                type        : 'کارکنوں کا تصادم',
                details     : 'bai larai ho rahi hae sir',
                area        : 'UC-112',
                complainent : 'Usman Mehmod',
                mobile      : '0300-5599660',
                time        : '2022-03-21 04:10 PM',
                status      : 'unresolved'
            },
            {
                id          : 3,
                type        : 'سرکاری عملے کی غیرقانونی مداخلت',
                details     : 'hmaray voter ko andr janay nahi de rahay',
                area        : 'UC-112',
                complainent : 'Usman Mehmod',
                mobile      : '0300-5599660',
                time        : '2022-03-21 03:54 PM',
                status      : 'resolved'
            },
            {
                id          : 4,
                type        : 'کارکنوں کا تصادم',
                details     : '',
                area        : 'UC-112',
                complainent : 'Usman Mehmod',
                mobile      : '0300-5599660',
                time        : '2022-03-21 02:22 PM',
                status      : 'resolved'
            },
            {
                id          : 5,
                type        : 'سرکاری عملے کا ناروا سلوک',
                details     : '',
                area        : 'یو سی رئیہ خاص نارووال',
                complainent : 'Usman Mehmod',
                mobile      : '0300-5599660',
                time        : '2022-03-21 11:22 AM',
                status      : 'unresolved'
            }
        ]
    }
};
