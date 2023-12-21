import { createRequire } from "module";
const require = createRequire(import.meta.url);
require('dotenv').config()

import { Network } from '@injectivelabs/networks'
import {
    PrivateKey,
    MsgSend,
    MsgBroadcasterWithPk
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'

// 设置私钥
const privateKeyHash = process.env.PRIVATE_KEY;

// 设置转账的接收方账户
const toAccount = process.env.TO_ACCOUNT;

// 设置转账的金额
const transferAmount = process.env.AMOUNT;

// 设置转账的次数
const transferCount = process.env.TRANSFER_COUNT;

// 设置自定义的数据
const customData = process.env.CUSTOM_DATA;

;(async () => {
    const privateKey = PrivateKey.fromHex(privateKeyHash)
    const injectiveAddress = privateKey.toBech32()

    const amount = {
        denom: 'inj',
        amount: new BigNumberInBase(transferAmount).toWei().toFixed(),
    }

    const msg = MsgSend.fromJSON({
        amount,
        memo: customData,
        srcInjectiveAddress: injectiveAddress,
        dstInjectiveAddress: toAccount,
    })

    // 创建一个循环来进行多次转账
    for (let i = 0; i < transferCount; i++) {
        const txHash = await new MsgBroadcasterWithPk({
            privateKey,
            network: Network.Mainnet
        }).broadcast({
            msgs: msg
        })
        console.log(`${txHash}-${i+1}`)
    }
})()