// 1. Updated Constants - src/lib/constants.tsx
import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"
import Image from "next/image"

// Add Razorpay/Curlec icon (you can create a custom one or use CreditCard)
const RazorpayIcon = () => (
  <Image
    src="/images/razorpay.png"
    alt="Razorpay Icon"
    width={96}
    height={96}
  />
)

/* Map of payment provider_id to their title and icon */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  // pp_system_default: {
  //   title: "Manual Payment",
  //   icon: <CreditCard />,
  // },
  // "pp_stripe-payment_my-payment": {
  //   title: "Custom Payment",
  //   icon: <CreditCard />,
  // },
  // Razorpay Curlec Integration
  pp_razorpay_razorpay: {
    title: "Razorpay Curlec",
    icon: <RazorpayIcon />,
  },
}

// Payment method detection functions
export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_")
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

export const isCustom = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe-payment")
}

// Razorpay detection function
export const isRazorpay = (providerId?: string) => {
  return providerId?.startsWith("pp_razorpay")
}

// Currency configurations
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

// Malaysian specific configurations
export const malaysianPaymentMethods = {
  fpx_banks: [
    { code: "maybank2u", name: "Maybank2u", logo: "/banks/maybank.png" },
    { code: "cimb", name: "CIMB Clicks", logo: "/banks/cimb.png" },
    { code: "public_bank", name: "Public Bank", logo: "/banks/public.png" },
    { code: "rhb", name: "RHB Bank", logo: "/banks/rhb.png" },
    {
      code: "hong_leong",
      name: "Hong Leong Bank",
      logo: "/banks/hong_leong.png",
    },
    { code: "ambank", name: "AmBank", logo: "/banks/ambank.png" },
    { code: "affin", name: "Affin Bank", logo: "/banks/affin.png" },
    { code: "alliance", name: "Alliance Bank", logo: "/banks/alliance.png" },
    { code: "bank_islam", name: "Bank Islam", logo: "/banks/bank_islam.png" },
    {
      code: "bank_muamalat",
      name: "Bank Muamalat",
      logo: "/banks/muamalat.png",
    },
    { code: "bank_rakyat", name: "Bank Rakyat", logo: "/banks/rakyat.png" },
    { code: "bsn", name: "BSN", logo: "/banks/bsn.png" },
    { code: "hsbc", name: "HSBC Bank", logo: "/banks/hsbc.png" },
    { code: "ocbc", name: "OCBC Bank", logo: "/banks/ocbc.png" },
    {
      code: "standard_chartered",
      name: "Standard Chartered",
      logo: "/banks/sc.png",
    },
    { code: "uob", name: "UOB Bank", logo: "/banks/uob.png" },
  ],
  wallets: [
    { code: "boost", name: "Boost", logo: "/wallets/boost.png" },
    { code: "grabpay", name: "GrabPay", logo: "/wallets/grabpay.png" },
    { code: "tng", name: "Touch 'n Go eWallet", logo: "/wallets/tng.png" },
    { code: "maybank_qr", name: "Maybank QR", logo: "/wallets/maybank_qr.png" },
    { code: "shopeepay", name: "ShopeePay", logo: "/wallets/shopeepay.png" },
  ],
  cards: [
    { network: "visa", name: "Visa", logo: "/cards/visa.png" },
    {
      network: "mastercard",
      name: "Mastercard",
      logo: "/cards/mastercard.png",
    },
    { network: "amex", name: "American Express", logo: "/cards/amex.png" },
  ],
}
