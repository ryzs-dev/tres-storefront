"use client"

import React, { useEffect, useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch"
import { searchClient } from "../../../../lib/config"
import Modal from "../../../common/components/modal"
import { Button } from "@medusajs/ui"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

type Hit = {
  id: string
  title: string
  description: string
  handle: string
  thumbnail: string
  categories: {
    id: string
    name: string
    handle: string
  }[]
  tags: {
    id: string
    value: string
  }[]
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <div className="flex items-center gap-x-6 h-full ">
        <Button
          onClick={() => setIsOpen(true)}
          variant="transparent"
          className="hover:text-ui-fg-base px-2 hover:bg-transparent focus:!bg-transparent"
          aria-label="Search"
        >
          <Search className="w-6 h-6 text-tres-primary" />
        </Button>
      </div>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
        <div className="h-[100dvh] sm:h-auto sm:max-h-[80vh] overflow-y-auto p-4">
          <InstantSearch
            searchClient={searchClient}
            indexName={process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME}
          >
            <SearchBox className="w-full [&_input]:w-[94%] [&_input]:outline-none [&_button]:w-[3%]" />
            <Hits hitComponent={Hit} />
          </InstantSearch>
        </div>
      </Modal>
    </>
  )
}

const Hit = ({ hit }: { hit: Hit }) => {
  return (
    <Link
      href={`/products/${hit.handle}`}
      aria-label={`View product: ${hit.title}`}
      className="flex items-center gap-3 py-2 rounded-md hover:bg-gray-50 transition"
    >
      {/* Square thumbnail */}
      <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={hit.thumbnail}
          alt={hit.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-sm font-medium leading-snug truncate">
          {hit.title}
        </h3>
      </div>
    </Link>
  )
}
