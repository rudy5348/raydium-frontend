import Decimal from 'decimal.js'
import { SplToken } from '@/application/token/type'
import RectTabs, { TabItem } from '@/components/RectTabs'
import { useCallback, useMemo } from 'react'
import CoinAvatarPair from '@/components/CoinAvatarPair'
import { Fraction } from 'test-r-sdk'
import { toString } from '@/functions/numberish/toString'
import { div } from '@/functions/numberish/operations'

interface Props {
  coin1?: SplToken
  coin2?: SplToken
  fee?: string
  currentPrice?: Fraction
  isPairPoolDirectionEq: boolean
  focusSide: 'coin1' | 'coin2'
  onChangeFocus: (focusSide: 'coin1' | 'coin2') => void
}

export function PairInfoTitle(props: Props) {
  const { coin1, coin2, currentPrice, fee, focusSide, isPairPoolDirectionEq, onChangeFocus } = props
  const isFocus1 = focusSide === 'coin1'

  const tabs = useMemo(() => {
    const tabs: TabItem[] = []
    coin1 && tabs.push({ name: `${coin1.symbol || 'Unknown'} price`, value: coin1.id })
    coin2 && tabs.push({ name: `${coin2.symbol || 'Unknown'} price`, value: coin2.id })
    return tabs
  }, [coin1, coin2])

  const handleChangeFocus = useCallback(
    (tab: TabItem) => {
      onChangeFocus(tab.value === coin2!.id ? 'coin2' : 'coin1')
    },
    [coin2]
  )

  const getPrice = () => {
    if (!currentPrice || !coin1 || !coin2) return ''
    if (isPairPoolDirectionEq) return toString(currentPrice, { decimalLength: coin1.decimals })
    return toString(div(1, currentPrice), { decimalLength: coin2.decimals })
  }

  const [coin1Symbol = '--', coin2Symbol = '--'] = isFocus1
    ? [coin1?.symbol, coin2?.symbol]
    : [coin2?.symbol, coin1?.symbol]

  return (
    <div className="flex justify-between items-center mb-[27px]">
      <div className="flex items-center">
        <CoinAvatarPair size="lg" token1={coin1} token2={coin2} />
        <span className="ml-2 text-xl font-medium text-white">
          {coin1?.symbol || '-'} / {coin2?.symbol || '-'}
        </span>
        <div className="px-2.5 py-1 ml-2 rounded-lg text-sm text-secondary-title bg-active-tab-bg">
          Pool Fee {fee || '-'}
        </div>
      </div>
      <div className="flex items-center">
        {currentPrice && (
          <>
            {getPrice()} {coin2Symbol} per {coin1Symbol}
          </>
        )}
        {coin1 && coin2 && (
          <RectTabs
            classNames="ml-4"
            tabs={tabs}
            selected={isFocus1 ? coin1.id : coin2?.id}
            onChange={handleChangeFocus}
          />
        )}
      </div>
    </div>
  )
}
