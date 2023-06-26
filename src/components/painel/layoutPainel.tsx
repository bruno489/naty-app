import { Box, Button, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function LayoutPainel({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  return (
    <>
      <Box height={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
        <Box
          bgcolor="green"
          display="flex"
          justifyContent="center"
          height="40px"
        >
          <div
            style={{
              maxWidth: '900px',
              display: 'flex',
              justifyContent: 'space-between',
              flex: '1',
              padding: '10px',
            }}
          >
            <div style={{ alignItems: 'center', display: 'flex' }}>
              API Deslocamento
            </div>
            <div style={{ alignItems: 'center', display: 'flex' }}>
              <Button
                id="demo-positioned-button"
                aria-controls={openMenu ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
                onClick={e => {
                  setOpenMenu(true)
                  setAnchorEl(e.currentTarget)
                }}
                style={{
                  color: 'white',
                }}
              >
                Dashboard
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                open={openMenu}
                onClose={() => setOpenMenu(false)}
                anchorEl={anchorEl}
              >
                <MenuItem
                  onClick={() => {
                    router.push('/')
                  }}
                >
                  Clientes
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push('/condutor')
                  }}
                >
                  Condutor
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push('/deslocamento')
                  }}
                >
                  Deslocamento
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push('/veiculo')
                  }}
                >
                  Veículo
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Box>
        <Box
          flex="1"
          overflow="auto"
          maxWidth="900px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          margin="0 auto"
          paddingBottom="10px"
        >
          {children}
        </Box>
      </Box>
    </>
  )
}
